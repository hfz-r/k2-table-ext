/* eslint-disable no-console */
// const url = 'https://bpmdev.affinhwangam.com/api/odata/v3/Commission_dbo_COARebateFeeMgmt';

const promiseWrapper = promise => {
  let status = 'pending';
  let result;

  const suspender = promise.then(
    r => {
      status = 'success';
      result = r;
    },
    e => {
      status = 'error';
      result = e;
    }
  );

  return {
    // eslint-disable-next-line consistent-return
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    },
  };
};

const fetchSMO = () => {
  return new Promise(resolve => {
    fetch('payload.json', {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      console.log('fetched payload');
      resolve(response.json());
    });
  });
};

export function fetchPayload() {
  const pl = fetchSMO();
  return {
    payload: promiseWrapper(pl),
  };
}
