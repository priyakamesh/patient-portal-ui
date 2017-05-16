patient_portal.factory("AuthFactory", function($http) {
  var currentPatient = {};
  return {
    getter: (email,password,confirmpassword) => {
      return $http.post(`https://patient-portal-api.herokuapp.com/api/v1/patient/new`, {
        email : email,
        password: password,
        confirmation: confirmpassword
      })
      .then((data) =>{
        currentPatient = data.data.patient
        return data
      })
      .catch((data) =>{
        return data
      })
    }
    ,setter: (email,password) =>{
    return $http.post(`https://patient-portal-api.herokuapp.com/api/v1/patient/check`,{
      email: email,
      password: password
    })
    .then((data) =>{
      currentPatient = data.data.patient
      console.log("currentPatient",currentPatient);
      return data.data.patient.id
    })
    .catch ((data) =>{
      return data
    })

  },
  getCurrentPatient: () =>{
    console.log("currentPatient from getCurrentPatient",currentPatient);
    return currentPatient
  }
}
})
