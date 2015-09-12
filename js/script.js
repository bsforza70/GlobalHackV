var x; var y;
function violations() {
  Tabletop.init( { key: '17bDo_Ang2nOfj9Ttj__jymIMetRR86g-eDoF40EZcC0',
                   callback: function(data, tabletop) { 

                        console.log(data);
                        x = data; 
                        
                        localStorage.setItem("violations", JSON.stringify(x));
                   },
                   simpleSheet: true } )
}
function citations() {
      Tabletop.init( { key: '1vi8neFTP5YyQdWDfu9RV7YLhWUF7ceoaVv9Hdga_Qas',
                   callback: function(data, tabletop) { 

                        console.log(data);
                        y = data; 
                        
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
            x = JSON.parse(localStorage.getItem("violations"));
            y = JSON.parse(localStorage.getItem("citations"));
      }
}

// // store
// localStorage.setItem("violations", x);

// // retrieve
// console.log(localStorage.getItem("hello"));

// // delete
// localStorage.removeItem("hello");

// var testObject = { 'one': 1, 'two': 2, 'three': 3 };

// // Put the object into storage
// localStorage.setItem('testObject', JSON.stringify(testObject));

// // Retrieve the object from storage
// var retrievedObject = localStorage.getItem('testObject');

// console.log('retrievedObject: ', JSON.parse(retrievedObject));