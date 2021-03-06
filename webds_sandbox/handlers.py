import os
import json
import time

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

import sys
sys.path.append('/usr/local/syna/lib/python')
from touchcomm import TouchComm

tcm = None

fib_go = True

def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b
        if a > 10000:
            a, b = 0, 1

class DataSource(object):
    def __init__(self, initial_data=None):
        self._data = initial_data

    @property
    def data(self):
        return self._data

    @data.setter
    def data(self, new_data):
        self._data = new_data

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /webds-sandbox/get_example endpoint!"
        }))

class FoobarHandler(APIHandler):
    def initialize(self, source, update):
        self.source = source
        self.update = update
        self._last = None
        self.set_header('cache-control', 'no-cache')

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def publish(self, data):
        try:
            self.set_header('content-type', 'text/event-stream')
            self.write('event: fib\n')
            self.write('data: {\n')
            self.write('data: "num": "{}"\n'.format(data))
            self.write('data: }\n\n')
            yield self.flush()
        except tornado.iostream.StreamClosedError:
            pass

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def get(self):
        query = self.get_argument('query', None, True)
        #print('query: {}'.format(query))
        if query == 'fib':
            global fib_go
            self.update.start()
            while fib_go:
                if self.source.data != self._last:
                    yield self.publish(self.source.data)
                    self._last = self.source.data
                else:
                    yield tornado.gen.sleep(0.005)
            self.set_header('content-type', 'text/event-stream')
            self.write('id: stop\n')
            self.write('data: {}\n\n')
            yield self.flush()
        if query == 'baz':
            connected=os.path.isfile('/tmp/.android.connected')
            self.set_header('content-type', 'application/json')
            self.finish(json.dumps({
                "data": connected
            }))

    @tornado.web.authenticated
    def post(self):
        global fib_go
        fib_go = False
        input_data = self.get_json_body()
        data = {"data": "{}".format(input_data["data"])}
        self.set_header('content-type', 'application/json')
        self.finish(json.dumps(data))

class FilesystemHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        print(self.request.arguments)
        print('location')
        location = self.request.arguments['location'][0].decode("utf-8")
        print(location)
        for label, files in self.request.files.items():
            print(label)
            for f in files:
                filename, content_type = f['filename'], f['content_type']
                print(filename, content_type)
        data = {'data': 'done'}
        self.set_header('content-type', 'application/json')
        self.finish(json.dumps(data))

class TouchcommHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        global tcm
        if (tcm == None):
            self.finish()
            return
        report = tcm.getReport()
        image = report[1]['image']
        image = image.tolist()
        self.finish(json.dumps(image))

    @tornado.web.authenticated
    def post(self):
        global tcm
        input_data = self.get_json_body()
        if (input_data['tcm'] == 'open'):
            if (tcm != None):
                tcm.close()
                time.sleep(1)
            tcm = TouchComm.make(protocols = 'report_streamer', server = '127.0.0.1', packratCachePath = '/var/cache/syna/packrat', streaming = False)
            tcm.reset()
            identify = tcm.identify()
            appInfo = tcm.getAppInfo()
            print(identify, flush = True)
            print(appInfo, flush = True)
            tcm.disableReport(17)
            if (input_data['report'] == 'Delta Image'):
                tcm.disableReport(19)
                tcm.enableReport(18)
            elif (input_data['report'] == 'Raw Image'):
                tcm.disableReport(18)
                tcm.enableReport(19)
            data = {'numRows': appInfo['numRows'], 'numCols': appInfo['numCols']}
            self.finish(json.dumps(data))
        elif (input_data['tcm'] == 'close'):
            if (tcm != None):
                tcm.reset()
                tcm.close()
                tcm = None
            self.finish()

def setup_handlers(web_app):
    host_pattern = ".*$"

    generator = fibonacci()
    publisher = DataSource(next(generator))
    def get_next():
        publisher.data = next(generator)
    checker = tornado.ioloop.PeriodicCallback(lambda: get_next(), 100.)

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "webds-sandbox", "get_example")
    foobar_pattern = url_path_join(base_url, "webds-sandbox", "foobar")
    filesystem_pattern = url_path_join(base_url, "webds-sandbox", "filesystem")
    touchcomm_pattern = url_path_join(base_url, "webds-sandbox", "touchcomm")
    handlers = [(route_pattern, RouteHandler), (foobar_pattern, FoobarHandler, dict(source=publisher, update=checker)), (filesystem_pattern, FilesystemHandler), (touchcomm_pattern, TouchcommHandler)]
    web_app.add_handlers(host_pattern, handlers)
