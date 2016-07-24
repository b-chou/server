export default `
  <html>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script>
      $.ajax({
        url: 'http://107.170.231.229:8000/getcurrentevents?day=1',
        method: 'GET'
      }).done(function() {
        var events = data.events;
        var startId = events[0].id;
          setTimeout(function() {
            var randomHype = Math.floor(Math.random() * (30 - startId)) + startId;
            $.ajax({
              url: 'http://107.170.231.229:8000/hypecount',
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              data: {
                Hypee: randomHype,
                timestamp: Date.now(),
              },
            }, i * 200);
        })
      });
    </script>
    <button>UNLEASH THE BEAST</button>
  </html>
`;
