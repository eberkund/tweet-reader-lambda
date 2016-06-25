# Tweet Reader Lambda

A simple project for authenticating with Twitter and caching a user's tweets in a static file.

## Usage

Once you have a `tweets.json` file you can easily display it with JavaScript.

    (function () {

        $.get('/tweets.json', function (data) {
            var str = '<ul>';

            for (var i = data.length - 1; i >= 0; i--) {
                console.log(i);
                console.log(str);
                str += '<li>';
                str +=  data[i].text;
                str += '</li>';
            }

            str += '</ul>';

            $("#twitter-timeline").html(str);
        });

    })();