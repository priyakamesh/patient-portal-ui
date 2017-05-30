patient_portal.controller('FormCtrl', function($scope, AuthFactory,$location, $http){
  $scope.currentUser = AuthFactory.getCurrentPatient()
  if($scope.currentUser.id) {
    $scope.date = new Date()
    $(function() {
      Materialize.updateTextFields();
  });
    $http.get('https://patient-portal-api.herokuapp.com/api/v1/doctors')
    .then((data) =>{
      $scope.doctorname = data.data.doctors
    })

    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}/doctor`)
    .then((data) =>{
      $scope.patientDoctor = data.data.doctor
    })
    .catch((err) =>{
    })
    $scope.keydown = () =>{
        $scope.doctorfullname = $('#full_name').val();
        $http.get(`https://patient-portal-api.herokuapp.com/api/v1/doctors/check/${$scope.doctorfullname}`)
        .then((data) =>{
          $scope.doctorSpeciality = data.data.doctor[0].speciality
          $scope.doctorAddress = data.data.doctor[0].address
          $scope.doctorPhonenumber = data.data.doctor[0].phonenumber
          $(function() {
              Materialize.updateTextFields();
          });
        })
        .catch((err) =>{
        })
  }
    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/insurance/${$scope.currentUser.id}`)
    .then((data) =>{
      $scope.patientInsurance = data.data.insurance
    })
    .catch((err) =>{
    })

    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}/release_med_info`)
    .then((data) =>{
      $scope.releasePerson = data.data
    })
    .catch((err) =>{
    })

    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/foodallergy`)
    .then((data)=>{
      $scope.foodallergys = data.data.food_allergy
    })
    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/drugallergy`)
    .then((data)=>{
      $scope.drugallergys = data.data.drug_allergy
    })
    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}/allergy`)
    .then((allergy) =>{
      $scope.allergys = allergy.data.allergy
    })
    .catch((err) =>{
    })

    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/socialhistory`)
    .then((data) =>{
      $scope.socialHistories = data.data.social_history
    })
    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/familyhistory`)
    .then((data) =>{
      $scope.familyHistories = data.data.family_history
    })

    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}/history`)
    .then((history) =>{
      $scope.histories = history.data.history
    })
    .catch((err) =>{
    })

    $http.get(`https://patient-portal-api.herokuapp.com/api/v1/patients/${$scope.currentUser.id}/medication`)
    .then((data) =>{
      $scope.medications = data.data.medications
    })
    .catch((err) =>{
    })


   $scope.finish = () =>{
    $http.patch(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}`,{
        firstname: $scope.currentUser.firstname,
        lastname: $scope.currentUser.lastname,
        dob: $scope.currentUser.dob,
        ethnicity: $scope.currentUser.ethnicity,
        address: $scope.currentUser.address,
        phonenumber: $scope.currentUser.phonenumber
      })
      $scope.doctorfullname = $('#full_name').val();
      $http.get(`https://patient-portal-api.herokuapp.com/api/v1/doctors/check/${$scope.doctorfullname}`)
      .then((data) =>{
        $scope.doctorid = data.data.doctor[0].id
      $http.post(`https://patient-portal-api.herokuapp.com/api/v1/addPatientDoctor/${$scope.currentUser.id}/${$scope.doctorid}`,{
        patient_id: $scope.currentUser.id,
        doctor_id: $scope.doctorid
      })
      .catch((data) =>{
        Materialize.toast(`${$scope.doctorfullname} is already in your profile`,2000)
      })
      })
    $scope.insuranceType = $('#insuranceType').val();
      if ($scope.insuranceType === 'Primary'){
        $scope.patientInsurance.insurance_type_id = 1

      }
      else {
        $scope.patientInsurance.insurance_type_id = 2
      }
      if($scope.patientInsurance.insuranceprovider !== undefined) {
        $http.post(`https://patient-portal-api.herokuapp.com/api/v1/insurance/${$scope.currentUser.id}`,{
          insuranceprovider: $scope.patientInsurance.insuranceprovider,
          groupid: $scope.patientInsurance.groupid,
          subscriberid: $scope.patientInsurance.subscriberid,
          insurance_type_id: $scope.patientInsurance.insurance_type_id,
          patient_id: $scope.currentUser.id
        })
        .catch((err) =>{
        })
      }
      if($scope.releasePerson.fullname !== undefined) {
        $http.post(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}/release_med_info/new`,{
            fullname: $scope.releasePerson.fullname,
            relation: $scope.releasePerson.relation,
            phonenumber: $scope.releasePerson.phone,
            patient_id: $scope.currentUser.id
          })
          .catch((err) =>{
            Materialize.toast(`${$scope.releasePerson.fullname} is already in your account`,2000)
          })
      }
    $scope.patientAllergys = [];
      $('input[name="foodallergys"]:checked').map(function() {
                  $scope.patientAllergys.push($(this).val());
      });
      $('input[name="drugallergys"]:checked').map(function() {
                  $scope.patientAllergys.push($(this).val());
      });
      if($scope.patientAllergys.length >0){
        $http.post(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}/allergy`,{
          allergy_id : $scope.patientAllergys
        })
        .catch((err) =>{
        })
      }
       $scope.patientHistory = [];

      $('input[name="familyHistories"]:checked').map(function() {
                  $scope.patientHistory.push($(this).val());
      });
      $('input[name="socialHistories"]:checked').map(function() {
                  $scope.patientHistory.push($(this).val());
      });

      if($scope.patientHistory.length > 0){
        $http.post(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}/history`,{
          history_id : $scope.patientHistory
        })
        .catch((err) =>{
        })
      }
     $scope.medications.route = $("#route").val()
      if ($scope.medications.medication_type === 'Current') {
        $scope.medications.medication_type_id = 1
      } else if($scope.medications.medication_type === 'Discontinued'){
        $scope.medications.medication_type_id = 2
      }

      if($scope.medications.medication_type_id === 1 ) {
        $http.post(`https://patient-portal-api.herokuapp.com/api/v1/patients/${$scope.currentUser.id}/currentmedication/new`,{
          brandname: $scope.medications.brandname,
          drugname: $scope.medications.drugname,
          dosage: $scope.medications.dosage,
          route: $scope.medications.route,
          medication_type_id: $scope.medications.medication_type_id,
          patient_id: $scope.currentUser.id
        })
        .catch((err) =>{
        })
      }
      else if($scope.medications.medication_type_id === 2) {
        $http.post(`https://patient-portal-api.herokuapp.com/api/v1/patients/${$scope.currentUser.id}/dismedication/new`,{
            brandname: $scope.medications.brandname,
            drugname: $scope.medications.drugname,
            dosage: $scope.medications.dosage,
            route: $scope.medications.route,
            medication_type_id: $scope.medications.medication_type_id,
            patient_id: $scope.currentUser.id
          })
          .catch((err) =>{
          })
      }
    $location.url('/profile')
   }
   }
   else {
    $location.path("/")
   }
})
