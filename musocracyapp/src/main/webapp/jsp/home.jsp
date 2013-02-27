<!DOCTYPE html>
<html>
<head>
    <title>DX Ticker</title>
    <!-- Bootstrap
    <link href="/j/css/bootstrap.min.css" rel="stylesheet" media="screen"> -->
</head>
<body>
<h1>dx-ticker</h1>
<script src="/dx-ticker/js/jquery-1.9.1.js"></script>

<div id="main-container">
    <div id="ticker-container"/>
</div>

<script type="text/javascript">

    console.log('calling service');
    jQuery.ajax({
        url: "/dx-services/menuItems",
        beforeSend: function ( xhr ) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function ( data ) {

                var out = '';
                var resultObj = jQuery.parseJSON(data);

                jQuery.each(resultObj, function(i, obj) {
                    out +=  obj.displayName + ' : $' + obj.price + ' \n';
                });

                $('#ticker-container').html(out);

            });


</script>


</body>
</html>