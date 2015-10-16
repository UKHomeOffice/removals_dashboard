var expect = require('expect.js');
var _ = require('underscore');
var socket = require('socket-io-mock');
var sailsIOClient = require('sails.io.js');

var collections = require('../assets/js/collections');
var models = require('../assets/js/models');
var faker = require('../assets/simulator/faker');

describe('collections', function () {
  describe('centres', function() {
    it('should be instantiated', function() {
      var collection = new collections.Centres();

      expect(collection).not.to.be(undefined);
      expect(collection.model).to.be(models.Centre);
      expect(collection).to.have.length(0);
    });
    it('should have an externally defined URL root when the option is set', function() {
      var collection = new collections.Centres([],{ url: 'http://example.com/centres'});

      expect(collection.url).to.be('http://example.com/centres');
    });
    it('should add a model', function() {
      var collection = new collections.Centres();

      collection.add(new models.Centre());

      expect(collection).to.have.length(1);
    });
    it('should update an existing model', function() {
      var centre = new models.Centre();
      var collection = new collections.Centres(centre);

      collection.add(new models.Centre());

      expect(collection).to.have.length(2);

      collection.add(centre);

      expect(collection).to.have.length(2);
    });
    it('should remove a model', function() {
      var centre = new models.Centre();
      var collection = new collections.Centres(centre);

      collection.remove(centre);

      expect(collection).to.have.length(0);
    });
  });
});

describe('models', function() {
  describe('centre', function() {
    beforeEach(function() {
      var io;

      this.server = new socket();
      this.fakeio = function(server) {
        return function() {
          return server.socketClient;
        }
      };

      io = sailsIOClient(this.fakeio(this.server));
      io.sails.autoConnect = false;

      this.socket0 = io.sails.connect();
    });

    it('should be instantiated', function() {
      var model = new models.Centre();
      return expect(model).not.to.be(undefined);
    });

    it('should respond to socket events', function(done) {
      var model = new models.Centre([], { socket: this.socket0 });

      model.socket.on('message', function(payload) {
        expect(payload).to.be('test message');
        return done();
      });

      this.server.emit('message','test message');
    });

    it('should populate its data on initial payload', function(done) {
      var model = new models.Centre([], { socket: this.socket0 });

      model.on('change', function() {
        expect(model.toJSON()).to.have.keys(['name','centre_id','beds','links']);
        return done();
      });

      this.server.emit('populate', faker.Centre(_.random(0,2)));

    });
  });
});
