const { _internal,getStats,getServerHealth } = require('../logic');


describe('getStats tests', () => {
  test('test instance id', () => {
    var statsResp = getStats()
    expect(statsResp.instanceId).toBe('local-instance');
  });
  test('test item count', () => {
    var statsResp = getStats()
    expect(statsResp.totalItems).toBe(_internal.items.length);
  });
})

describe('health tests', () => {
  test('test status', () => {
    var healthResp = getServerHealth()
    expect(healthResp.status).toBe('ok');
  });
  test('test request count', () => {
    var healthResp = getServerHealth()
    expect(healthResp.handledRequests).toBe(4);
  });
})

