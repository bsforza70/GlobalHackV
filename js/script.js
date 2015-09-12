var citationList; var violationList;
function violations() {
  Tabletop.init( { key: '17bDo_Ang2nOfj9Ttj__jymIMetRR86g-eDoF40EZcC0',
                   callback: function(data, tabletop) { 

                        console.log(data);
                        violationList = data; 
                        
                        localStorage.setItem("violations", JSON.stringify(x));
                   },
                   simpleSheet: true } )
}
function citations() {
      Tabletop.init( { key: '1vi8neFTP5YyQdWDfu9RV7YLhWUF7ceoaVv9Hdga_Qas',
                   callback: function(data, tabletop) { 

                        console.log(data);
                        citationList = data; 
                        
                        localStorage.setItem("citations", JSON.stringify(y));
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
      // if input 1:
      // return search(inputText, null);
      // else if input 2:
      // return search(null, inputText);
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
      var violationResults = [];
      citationResults.forEach(function (citation) {
            violationList.forEach(function (violation) {
                  if (citation["citation_number"] === violation["citation_number"]) {
                        violationResults.push(violation);
                  }
            });
      });
      console.log("HI");
      return violationResults;
}
