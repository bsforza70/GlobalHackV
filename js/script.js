var citationList; var violationList; var a; var citationResults; var gains = []; var twel; var gainMark = [];
function violations() {
  Tabletop.init( { key: '17bDo_Ang2nOfj9Ttj__jymIMetRR86g-eDoF40EZcC0',
                   callback: function(data, tabletop) { 

                        console.log(data);
                        violationList = data; 
                        
                        localStorage.setItem("violations", JSON.stringify(violationList));
                   },
                   simpleSheet: true } )
}
function citations() {
      Tabletop.init( { key: '1vi8neFTP5YyQdWDfu9RV7YLhWUF7ceoaVv9Hdga_Qas',
                   callback: function(data, tabletop) { 

                        console.log(data);
                        citationList = data; 
                        
                        localStorage.setItem("citations", JSON.stringify(citationList));
                   },
                   simpleSheet: true } )
}

function StoreOffline() {
      violations();
      citations();
}

if (typeof window.localStorage != "undefined") {
      if (localStorage.getItem("violations") == null || localStorage.getItem("citations") == null) {
            StoreOffline();
      }
      else {
            violationList = JSON.parse(localStorage.getItem("violations"));
            citationList = JSON.parse(localStorage.getItem("citations"));
      }
}

function readSearch() {
      if (document.getElementById("numtype").options[document.getElementById("numtype").selectedIndex].value == "DL") {
         search(document.getElementById("cd-name").value, null);
      }
      else if (document.getElementById("numtype").options[document.getElementById("numtype").selectedIndex].value == "CN") {
         search(null, document.getElementById("cd-name").value);
      }

      document.getElementById("landing").style.display = "none";
      document.getElementById("results").style.display = "inherit";
}

// can search with license, citation, or both. if only one field is entered, other is null.
function search(searchLicense, searchCitation) {
      var citationResults = [];
      citationList.forEach(function (citation) {
            if (citation["citation_number"] === searchCitation ||
                  citation["drivers_license_number"] === searchLicense) {
                  citationResults.push(citation);
            }
      });

      function format(object, variable) {
         return (variable + ": " + object[variable] + "\n").toLowerCase();
      }

      // array of strings
      var text = [];
      citationResults.forEach(function (citation) {
         console.log(citation);
         gains.push(citation);
         var citationText = "";
         citationText += "Citation " + (citationResults.indexOf(citation) + 1) + "\n";
         citationText += format(citation, "court_date");
         citationText += format(citation, "court_location");
         citationText += format(citation, "court_address");
         text.push(citationText);
         violationList.forEach(function (violation) {
            if (citation["citation_number"] === violation["citation_number"]) {
               console.log(violation);
               gains.push(violation);
               violationText = "";
               violationText += format(violation, "violation_description");
               violationText += format(violation, "violation_number");
               violationText += "warrant: " + (violation["warrant_status"] === "TRUE" ? violation["warrant_number"] : "none") + "\n";
               violationText += format(violation, "court_cost");
               violationText += format(violation, "fine_amount");
               violationText += format(violation, "status");
               violationText += format(violation, "status_date");
               text.push(violationText);
            }
         });
      });
      append();
}

// Extra

function getFine(violation) {
      var fine = violation["fine_amount"];
      if (!fine) {
            return 0;
      }
      else return result = Number(fine.replace("$", ""));
}

function getAnalytics(selectedViolation, criteria) {
      var match = selectedViolation[criteria];
      var violationResults = [];
      violationList.forEach(function (violation) {
            if (violation[criteria] === match) {
                  violationResults.push(violation);
            }
      });

      // removes elements where cost = 0 (not filled in)
      for (var i = 0; i < violationResults.length; i++) {
            if (getFine(violationResults[i]) === 0) {
               console.log("Deleted");
               violationResults.splice(i, 1);
                  i--;
            }
      }

      // MEAN:
      var total = 0;
      violationResults.forEach(function (violation) {
            total += getFine(violation);
      });
      var mean = (total * 1.0 / violationResults.length).toFixed(2);

      // STANDARD DEVIATION
      var sum = 0;
      violationResults.forEach(function (violation) {
            sum += Math.pow(mean - getFine(violation), 2);
      });
      var std = Math.pow(sum * 1.0 / violationResults.length, .5).toFixed(2);

      // MEDIAN:
      // sort violationResults via selectionsort
      for (var i = 0; i < violationResults.length; i++) {
            var min = i;
            for (var j = i; j < violationResults.length; j++) {
                  if (getFine(violationResults[j]) < getFine(violationResults[min])) min = j;
            } // swap:
            var temp = violationResults[i];
            violationResults[i] = violationResults[min];
            violationResults[min] = temp
;      }

      var medianViolation = violationResults[Math.floor(violationResults.length / 2)];
      var median = getFine(medianViolation).toFixed(2);

      return {mean, median, std};
}

function append() {
   var twel = 0;
   gainMark = [];
   while (twel < gains.length) {
      if (gains[twel]["citation_date"] != undefined) {
         gainMark.push("citation");
      }
      else {
         gainMark.push("violation");
      }
      twel++;
   }
   console.log(gainMark);
   twel = 0;
   var cost = "";
   var pay = "";
   var warrant_count = 0;
   while (twel < gainMark.length) {
      if (gainMark[twel] == "citation") {
         document.getElementById('upload3me').insertAdjacentHTML( 'afterbegin', '<div class="row"> <div class="col-md-6 col-md-offset-3"><div class="card"><div class="card-content"><p>Citation: ' + gains[twel]["citation_number"] + '<br/>Court Date: ' + gains[twel]["court_date"].slice(0,-7) + '<br/>Court: ' + gains[twel]["court_address"] + ', ' + gains[twel]["court_location"].toLowerCase() + '<br/></p></div><div class="card-action"><a href="#" target="new_blank">Resolve</a><a href="#" target="new_blank">Find a Lawyer</a><a href="https://www.officialpayments.com/pay-citations-online.jsp" target="new_blank">Pay Online</a></div></div></div></div>');
      }
      else if (gainMark[twel] == "violation") {
         if (gains[twel]["warrant_status"] == "TRUE") {
            warrant_count++;
         }
         if (gains[twel]["fine_amount"] != "" && gains[twel]["court_cost"] != "") {
            cost = '<br/>Fine Amount: ' + gains[twel]["fine_amount"] + '<br/>Court Cost: ' + gains[twel]["court_cost"] + '<br/>'
         }
         document.getElementById('upload3me').insertAdjacentHTML( 'afterbegin', '<div class="row"> <div class="col-md-6 col-md-offset-3"><div class="card"><div class="card-content"><p>Violation: '+ gains[twel]["violation_number"] + '<br/>Reason: ' + gains[twel]["violation_description"] + cost + '</p></div><div class="card-action"><a href="#" target="new_blank">Resolve</a><a href="#" target="new_blank">Find a Lawyer</a></div></div></div></div>');
      }
      twel++;
   }

   if (warrant_count == 1) {
      document.getElementById('upload3me').insertAdjacentHTML( 'afterbegin', '<div class="row"> <div class="col-md-6 col-md-offset-3"><div style="background-color:rgba(231, 76, 60,1);color:white !important;" class="card"><div class="card-content"><p>Warning!<br/>There is a warrant out for your arrest!</p></div><div style="border-top: 2px white solid;" class="card-action"><a style="color:white;" href="#" target="new_blank">Resolve</a><a style="color:white;" href="#" target="new_blank">Find a Lawyer</a></div></div></div></div>');
   }
   else if (warrant_count > 1) {
      document.getElementById('upload3me').insertAdjacentHTML( 'afterbegin', '<div class="row"> <div class="col-md-6 col-md-offset-3"><div style="background-color:rgba(231, 76, 60,1);color:white !important;" class="card"><div class="card-content"><p>Warning!<br/>There are ' + warrant_count + ' warrants out for your arrest!</p></div><div style="border-top: 2px white solid;" class="card-action"><a style="color:white;" href="#" target="new_blank">Resolve</a><a style="color:white;" href="#" target="new_blank">Request a Lawyer</a></div></div></div></div>');
   }


}


// Citation 

// citation_date: "2/10/2015 0:00:00"
// citation_number: "877826802"
// court_address: "625 New Smizer Mill Road"
// court_date: "11/12/2015 0:00:00"
// court_location: "FENTON"
// date_of_birth: "4/10/1992 0:00:00"
// defendant_address: "62819 Jay Way"
// defendant_city: "HILLSDALE"
// defendant_state: "MO"
// drivers_license_number: "A840420280"
// first_name: "Lori"
// last_name: "Grant"

// violation

// citation_number: "866159336"
// court_cost: "$24.50"
// fine_amount: "$51.16"
// status: "CONT FOR PAYMENT"
// status_date: "8/7/2015"
// violation_description: "Improper Passing"
// violation_number: "866159336-01"
// warrant_number: ""
// warrant_status: "FALSE"




// <div class="row"> <div class="col-md-6 col-md-offset-3"><div class="card"><div class="card-content"><p>Cards for display in portfolio style material design by Google.</p></div><div class="card-action"><a href="#" target="new_blank">Resolve</a><a href="#" target="new_blank">Request a Lawyer</a></div></div></div></div>

