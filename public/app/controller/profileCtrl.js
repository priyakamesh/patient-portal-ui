patient_portal.controller('ProfileCtrl', function($location,$scope,$http, AuthFactory){
   $('.tooltipped').tooltip({delay: 50});
   $(".button-collapse").sideNav({
      menuWidth: 250, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    });
  $scope.active_portal = "";

  $scope.activePortalButton = (id) =>{
    $scope.active_portal = id
    $('.welcome').remove()
          $(function() {
          Materialize.updateTextFields();
      });
  }
   $scope.currentUser = AuthFactory.getCurrentPatient()
    if($scope.currentUser.id) {
      $scope.date = new Date()
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
      .catch((err) =>{})

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
        $scope.personal = () =>{
          $scope.currentUser.dob = JSON.stringify($scope.currentUser.dob)
          $scope.currentUser.dob = $scope.currentUser.dob.split("T",2)[0].slice(1)
          $http.patch(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}`,{
            firstname: $scope.currentUser.firstname,
            lastname: $scope.currentUser.lastname,
            dob: $scope.currentUser.dob,
            ethnicity: $scope.currentUser.ethnicity,
            address: $scope.currentUser.address,
            phonenumber: $scope.currentUser.phonenumber
          })
          .then((data) =>{
            Materialize.toast("Updated personal Information successfully",2000)
          })
        }
      $scope.deleteDoctor = (id) =>{
        $http.delete(`https://patient-portal-api.herokuapp.com/api/v1/deletePatientDoctor/${$scope.currentUser.id}/${id}`)
        .then((data) => {
          $(`#${id}`).remove()
          $http.get(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}/doctor`)
          .then((data) =>{
            $scope.patientDoctor = data.data.doctor
          })
          .catch((err) =>{
          })
        })
      }
      $scope.addDoctor = () =>{
        $location.url("/form")
      }
      $scope.release = () =>{
        $location.url("/form")
      }
      $scope.history = () =>{
        $location.url("/form")
      }
      $scope.allergy = () =>{
        $location.url("/form")
      }
      $scope.remove = (id) =>{
        $http.delete(`https://patient-portal-api.herokuapp.com/api/v1/insurance/${id}`)
        .then(() =>{
          $http.get(`https://patient-portal-api.herokuapp.com/api/v1/insurance/${$scope.currentUser.id}`)
            .then((data) =>{
              $scope.patientInsurance = data.data.insurance
            })
            .catch((err) =>{
            })
        })
        $(`#${id}`).remove()
      }
      $scope.removeMedication = (id, medication_type_id) =>{
        if(medication_type_id ===1){
          $http.delete(`https://patient-portal-api.herokuapp.com/api/v1/patients/${$scope.currentUser.id}/currentmedication/${id}`)
          .then(() =>{
            $(`#${id}`).remove()
            $http.get(`https://patient-portal-api.herokuapp.com/api/v1/patients/${$scope.currentUser.id}/medication`)
            .then((data) =>{
              $scope.medications = data.data.medications
            })
            .catch((err) =>{
            })
          })
        }
        else {
          $http.delete(`https://patient-portal-api.herokuapp.com/api/v1/patients/${$scope.currentUser.id}/dismedication/${id}`)
          .then(() =>{
            $http.get(`https://patient-portal-api.herokuapp.com/api/v1/patients/${$scope.currentUser.id}/medication`)
            .then((data) =>{
              $scope.medications = data.data.medications
            })
            .catch((err) =>{
            })
          })
        }
      }
      $scope.removeRelease = (id) =>{
        $http.delete(`https://patient-portal-api.herokuapp.com/api/v1/release_med_info/${id}`)
        .then(() =>{
          $http.get(`https://patient-portal-api.herokuapp.com/api/v1/patient/${$scope.currentUser.id}/release_med_info`)
            .then((data) =>{
              $scope.releasePerson = data.data
            })
            .catch((err) =>{
            })
        })
      }



    } else {
      $location.url("/")
    }
})
