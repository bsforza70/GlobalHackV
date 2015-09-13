var citationList; var violationList; var a; var gains = []; var twel; var gainMark = [];

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
      var id;
      citationList.forEach(function (citation) {
         if (citation["drivers_license_number"] === searchLicense) {
            citationResults.push(citation);
         }
         if (citation["citation_number"] === searchCitation) {
            id = citation["firstname"] + citation["lastname"] + citation["defendant_address"];
         }
      });
      citationList.forEach(function (citation) {
         if (citation["firstname"] + citation["lastname"] + citation["defendant_address"] === id) {
            citationResults.push(citation);
         }
      });

      function format(object, variable) {
         return (variable + ": " + object[variable] + "\n").toLowerCase();
      }

      // array of strings
      var text = [];
      citationResults.forEach(function (citation) {
         gains.push(citation);
         var citationText = "";
         citationText += "Citation " + (citationResults.indexOf(citation) + 1) + "\n";
         citationText += format(citation, "court_date");
         citationText += format(citation, "court_location");
         citationText += format(citation, "court_address");
         text.push(citationText);
         violationList.forEach(function (violation) {
            if (citation["citation_number"] === violation["citation_number"]) {
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
   while (twel < gainMark.length) {
      if (gainMark[twel] == "citation") {
         document.getElementById('upload3me').insertAdjacentHTML( 'afterbegin', '<div class="row"> <div class="col-md-6 col-md-offset-3"><div class="card"><div class="card-content"><p>Citation: ' + gains[twel]["citation_number"] + '</p></div><div class="card-action"><a href="#" target="new_blank">Resolve</a><a href="#" target="new_blank">Request a Lawyer</a></div></div></div></div>');
      }
      else if (gainMark[twel] == "violation") {
         document.getElementById('upload3me').insertAdjacentHTML( 'afterbegin', '<div class="row"> <div class="col-md-6 col-md-offset-3"><div class="card"><div class="card-content"><p>Violation: '+ gains[twel]["violation_number"] + '</p></div><div class="card-action"><a href="#" target="new_blank">Resolve</a><a href="#" target="new_blank">Request a Lawyer</a></div></div></div></div>');
      }
      twel++;
   }
}

/*****************************************************************************/
// LAWYER SEARCH:

var lawyerData = "The Powderly Law Firm, L.L.C.*314-301-8865*11965 Saint Charles Rock Road, Suite 202, St. Louis, MO 63044
JCS Law*314-732-4277*75 West Lockwood Avenue, Suite 222, St. Louis, MO 63119
Devereaux, Stokes, Nolan, Fernandez & Leonard, P.C.*314-621-3743*133 South 11th Street, Suite 350, St. Louis, MO 63102-1133
Law Office of Frank J. Niesen, Jr.*314-421-5800*319 North Fourth Street, Suite 200, St. Louis, MO 63102-1929
Shepherd, Taylor, Korum & Curtis, L.L.P.*314-714-4594*222 South Central Avenue, Suite 804, St. Louis, MO 63105-3592
The Law Office of Gregory N. Smith, LLC*314-492-6326*7733 Forsyth Boulevard, Suite 1850, St. Louis, MO 63105
Law Offices of Steven K. Brown*314-421-2011*1221 Locust Street, Suite 500, St. Louis, MO 63103
Kruse Law, LLC*314-297-0650*2016 S. Big Bend Boulevard, St. Louis, MO 63117
James F. Haffner*314-647-2112*3228 Ivanhoe, St. Louis, MO 63139
Kazanas LC Law Firm*314-685-8639*321 West Port Plaza Drive, Suite 201, St. Louis, MO 63146
The Welby Law Firm, LLC*314-309-2195*1221 Locust Street, 4th Floor, St. Louis, MO 63103
The Ross Law Firm, LLC*636-200-3785*16024 Manchester Road, Suite 200, St. Louis, MO 63011
Nick A. Zotos, Attorney at Law*314-534-1797*4235 Lindell Boulevard, St. Louis, MO 63108-2915
Law Offices of Wolff and D'Agrosa, LLC*314-725-8019*7710 Carondelet Avenue, Suite 200, St. Louis, MO 63105
Mandel & Mandel, L.L.P.*877-893-1256*1108 Olive Street, Fifth Floor, St. Louis, MO 63101-1922
Law Office of Amy R. Johnson, LLC*314-300-6789*3500 Magnolia Ave., St. Louis, MO 63118
Clooney & Anderson*314-492-6788*319 North Fourth Street, Suite 200, St. Louis, MO 63102
Missouri Traffic Pro, LLC*314-896-1934*2190 S. Mason Rd., Suite 200, St. Louis, MO 63131
The Lowry Law Firm*636-707-0168
Blackwell & Associates, P.C.*636-614-1771
Shea, Kohl & Alessi, LC*855-683-8265
Smith & Daiber, LLC*866-916-8339
The McKay Law Firm, LLC*636-556-0805";

function getLawyerData() {
   var lawyerData = prompt();
   result = [];
   lines = lawyerData.split("\n");
   lines.forEach(function(part) {
      var tag;
      switch (lines.indexOf(part)) {
         case 0: tag = "Name: "; break;
         case 1: tag = "Phone: "; break;
         case 2: tag = "Address: "; break;
      }
      result.push(tag + part + "");
   });
   return result;
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

