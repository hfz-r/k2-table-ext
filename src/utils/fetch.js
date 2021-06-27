const promiseWrapper = (promise) => {
  let status = "pending";
  let result;

  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
};

const fetchSMO = () => {
  return new Promise((resolve) => {
    fetch(process.env.REACT_APP_API_SRC, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log("fetched payload");
      resolve(response.json());
    });
  });
};

export function fetchPayload() {
  const smo = fetchSMO();
  return {
    payload: promiseWrapper(smo),
  };
}
