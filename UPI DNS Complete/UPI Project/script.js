function lookupTxtRecord() {
    event.preventDefault(); // Prevent default form submission
    
    const domainName = document.getElementById('domainName').value;
    const dnsLookupUrl = `https://hnslogin.world/?name=${domainName}&type=TXT`;
    
    fetch(dnsLookupUrl)
      .then(response => response.json())
      .then(data => {
        const upiRecord = data.Answer.find(record => record.data.includes('@'));
        if (upiRecord) {
          localStorage.setItem('txtRecord', upiRecord.data);
          window.location.href = 'Page-2.html'; // Redirect to result page
        } else {
          localStorage.setItem('error', 'UPI record not found');
          window.location.href = 'Page-2.html'; // Redirect to result page
        }
      })
      .catch(error => {
        console.error("Error fetching TXT record:", error);
        localStorage.setItem('error', error.message);
        window.location.href = 'Page-2.html'; // Redirect to result page
      });
  }
  