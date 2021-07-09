// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var copyMap = {
  'app.company.com' : 'companyapp.msappproxy.net',
  '.google.com/u/0' : '.google.com/u/1',
  'accounts.google.com/b/0/AddMailService' : 'mail.google.com/mail/u/1/#inbox',
  'google.com/calendar/u/0' : 'google.com/calendar/u/1',
}

var replaceMap = {
  'companyapp.msappproxy.net' : 'app.company.com'
}

function doWork()
{
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;

    let resultFound = false;

    for (var stringToFind in copyMap)
    {
        stringToReplaceWith = copyMap[stringToFind];

        if(url.includes(stringToFind))
        {
          url = url.replace(stringToFind, stringToReplaceWith)
          resultFound = true;
        }
    }

    if(resultFound == true)
    {
      chrome.tabs.update({url: url});
    }
  });
}

// Called when the user clicks on the browser button.
chrome.browserAction.onClicked.addListener(function(tab) {
    doWork();

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      
      for (var stringToFind in replaceMap)
      {
          stringToReplaceWith = replaceMap[stringToFind];
  
          if(url.includes(stringToFind))
          {
            url = url.replace(stringToFind, stringToReplaceWith)
          }
      }

      try {
        copyTextToClipboard(url);
        confirm("URL was Copied to Clipboard! \n" + url);
      }
      catch (err)
      {
        confirm("ERROR - URL was NOT Copied to Clipboard! \n" + err);
      }

    });
});

// Called when any page finishes loading
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    doWork();      
  }
});

//Copy Utility for Sharing URLs
//StackOverflow Reference - https://stackoverflow.com/a/18455088/2520289
function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to. 
  var copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child. 
  //"execCommand()" only works when there exists selected text, and the text is inside 
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand('copy');

  //(Optional) De-select the text using blur(). 
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor 
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}
