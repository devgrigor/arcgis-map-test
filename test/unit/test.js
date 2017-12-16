const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('requests', () => {
    let donation = {};
    let enums = {};


    it('responds with status 200 and log enums', function (done) {

        chai.request(app)
            .get('/api/enums')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                enums = JSON.parse(res.text);

                done();
            });
    });

    it('responds with status 201 submitting donation form', function (done) {

        chai.request(app)
            .post('/api/donations')
            .send({
                firstName: 'Test',
                lastName: 'Test',
                contactNumber: '00112233445566',
                email: 'test@email.com',
                geo: [10, 10],
                bloodGroup: enums.bloodGroup[0],
                antigen: enums.antigen[0]
            })
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);

                donation = JSON.parse(res.text);
                done();
            });
    });

    it('responds with status 500, not passing wrong validation ', function (done) {

        chai.request(app)
            .put('/api/donations/' + donation.linkId)
            .send({
                firstName: 'Test2',
                lastName: 'Test2',
                contactNumber: '00112233445577a',
                email: 'test@email',
                geo: [10, 10],
                bloodGroup: enums.bloodGroup[0],
                antigen: enums.antigen[0]
            })
            .end(function (err, res) {
                expect(err).to.be.an('error');
                expect(res).to.have.status(500);
                done();
            });
    });

    it('responds with status 200 submitting donation form', function (done) {

        chai.request(app)
            .put('/api/donations/' + donation.linkId)
            .send({
                firstName: 'Test2',
                lastName: 'Test2',
                contactNumber: '00112233445577',
                email: 'test@email.com',
                geo: [10, 10],
                bloodGroup: enums.bloodGroup[0],
                antigen: enums.antigen[0]
            })
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                donation = JSON.parse(res.text);

                expect(donation.firstName).to.equal('Test2');
                expect(donation.lastName).to.equal('Test2');
                expect(donation.contactNumber).to.equal('00112233445577');
                expect(donation.email).to.equal('test@email.com');
                expect(donation.geo).to.have.deep.members([10, 10]);
                expect(donation.bloodGroup).to.equal(enums.bloodGroup[0]);
                expect(donation.antigen).to.equal(enums.antigen[0]);

                done();
            });
    });

    it('responds with status 204 and remove donation', function (done) {
        chai.request(app)
            .delete('/api/donations/' + donation.linkId)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(204);

                done();
            });
    });

    it('responds with error 500', function (done) {
        chai.request(app)
            .get('/api/donations/' + donation.linkId)
            .end(function (err, res) {
                expect(err).to.be.an('error');
                expect(res).to.have.status(500);
                done();
            });
    });

});
