// Make a fetch request to the randomuser API and reutrn first user
addEventListener('fetchTest', async (resolve, reject, args) => {
  try {
    const res = await fetch('https://randomuser.me/api/');

    if (!res.ok) {
      throw new Error('Could not fetch user');
    }

    const result = await res.json();
    resolve(result['results'][0]);
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

// Trigger a local notification
addEventListener('notificationTest', async (resolve, reject, args) => {
  try {
    let scheduleDate = new Date();
    scheduleDate.setSeconds(scheduleDate.getSeconds());

    await CapacitorNotifications.schedule([
      {
        id: 42,
        title: 'Background Magic 🧙‍♂️',
        body: 'This comes from the background runner',
        scheduleAt: scheduleDate,
      },
    ]);

    resolve();
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

// Save a value to the Capacitor KV store
addEventListener('testSave', async (resolve, reject, args) => {
  try {
    CapacitorKV.set('foo', 'my bar 42');

    resolve();
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

// Get a value from the Capacitor KV store
addEventListener('testLoad', async (resolve, reject, args) => {
  try {
    const value = CapacitorKV.get('foo');

    resolve(value);
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

addEventListener('checkIn', async (resolve, reject, args) => { 
  try {

    const time = new Date().getTime();
    const location = await CapacitorGeolocation.getCurrentPosition({enableHighAccuracy: true});
    console.log('location.................', "");
    
    let checkinArr =  { location, time } || [];
    CapacitorKV.set('CHECKINS', JSON.stringify(checkinArr));
    resolve(checkinArr);
  } catch (err) {
    console.log('err!.................', err);
    reject(err);
  }
});



// Get all checkins from the Capacitor KV store
addEventListener('loadCheckins', async (resolve, reject, args) => {
  console.log("loadCheckins event fired.............",)
  try {
    const { value } = CapacitorKV.get('CHECKINS');
    console.log("value.............", value)
    resolve(JSON.parse(value));
  } catch (err) {
    console.error(err);
    reject(JSON.parse(err));
  } 
});
