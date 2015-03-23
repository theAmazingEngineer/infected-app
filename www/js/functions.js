// Globals
var counterBorders = 0;
var actualBorder = 0;

$(document).ready(function() {
	//$(document).on('mobileinit', function() {
		//$.mobile.changePage("#startPage");
		
		// are we running in native app or in a browser?
		window.isphone = false;
		
		if (document.URL.indexOf("http://") === -1 
			&& document.URL.indexOf("https://") === -1) {
			window.isphone = true;
		}
	    
		if (window.isphone) {
			//Wait for Cordova to connect with the device
			document.addEventListener("deviceready", onDeviceReady, false);
		}
		else {
			onDeviceReady();
		}
	//});
});

//var cameraOptions = { 
//	quality : 75,
//	destinationType : Camera.DestinationType.DATA_URL,
//	sourceType : Camera.PictureSourceType.CAMERA,
//	allowEdit : true,
//	encodingType: Camera.EncodingType.JPEG,
//	targetWidth: 100,
//	targetHeight: 100,
//	popoverOptions: CameraPopoverOptions,
//	saveToPhotoAlbum: false
//};

//Cordova is ready to be used!
function onDeviceReady() {
	//navigator.notification.alert('Device is ready!');
	//alert('Device is ready!');
	
	$('#user_name').val('');
	$('#user_password').val('');
	
	// Clear login form
	jQuery('#mainPage').on('pageshow', function(e) {
		$('#user_name').val('');
		$('#user_password').val('');
	});
    
	// Login button event
	$('#login_form').submit(function(e) { 
		//navigator.notification.alert('processing...');
		
		e.preventDefault();
		// recolecta los valores que inserto el usuario
		var user_name = $("#user_name").val()
		var user_password = $("#user_password").val()
		
		archivoValidacion = "https://tpdemos.com/imhere/controller.php"
		
		//var term= {usuario:datosUsuario, password:datosPassword}; 
		var params = {};
		params.k = 'app_login';
		params.user_name = user_name;
		params.user_password = user_password;
		
		$.ajax({
			url:archivoValidacion,
			type:'POST',
			data:params,
			//dataType:'json',
			dataType: "json",
			//jsonpCallback: 'logicaCliente',
			//error:function(jqXHR,text_status,strError){
			error:function(response) {
				navigator.notification.alert("APP error:" + response.responseText);
			},
			timeout:10000,
			success:function(response){
				//navigator.notification.alert(response.message + "\nGenerado en: " + response.hora)
				//alert(response.message);
				if (response.valid) {
					/// si la validacion es correcta, muestra la pantalla "home"
					
					//alert(response.fila);
				       //$.each(response.resultados, function(indice, valor) {
				       // var datos = response.records;
					///alert(response.fila);
					$('.txt_customer').html(response.cus_name);
					
					
					
					if (response.borders) {
						$('#content-borders-temp').html('<strong>MARCOS DISPONIBLES:</strong><br />');
						
						$.each(response.borders, function( index, value ) {
							//alert( index + ": " + value );
							counterBorders++;
							$('#content-borders-temp').append('<img class="border-thumbnail" src="' + value + '" alt="border-' + index + '" />');
							$('#workArea').append('<img class="border-image" src="' + value + '" id="border-' + counterBorders + '" alt="border-' + index + '" style="' + (counterBorders > 1 ? 'display: none;' : '') + '" />');
						});
						actualBorder = 1;
					}
					
				       // for(var i in datos){
					    //$('#workArea').append('<img src="' + data[i] + '" alt="" />');
					    //$('#workArea').append('<img src="' + valor + '" alt="" />');
					//    navigator.notification.alert(datos[i]);
					//}
					
					
					
					$('#content_customer').html('<img src="' + response.logo + '" alt="' + response.cus_name + '" />');
					$.mobile.changePage("#startPage");
				}
				else {
					/// ejecutar una conducta cuando la validacion falla
					navigator.notification.alert(response.message);
				}
			}
		});
		/*
		$.getJSON( archivoValidacion, {usuario: datosUsuario, password: datosPassword})
		.done(function(respuestaServer) {
			navigator.notification.alert(respuestaServer.message + "\nGenerado en: " + respuestaServer.hora)
			
			if (respuestaServer.validacion == "ok") {
				/// si la validacion es correcta, muestra la pantalla "home"
				$.mobile.changePage("#startPage");
			}
			else {
				/// ejecutar una conducta cuando la validacion falla
				navigator.notification.alert('Falló la autenticación');
			}
		})
		*/
		//return false;
	})
	
	// do everything here.
	$('.takeScreenShot').click(function() {
		navigator.camera.getPicture( cameraSuccess, cameraError, { quality: 50,
			destinationType: Camera.DestinationType.DATA_URL
		});
	});
	
	// Change border
	$('.changeBorderLeft').click(function() {
		if (actualBorder == 1) {
			actualBorder = counterBorders;
		}
		else {
			actualBorder--;
		}
		$('.border-image').hide();
		$('#border-' + actualBorder).show();
	});
	
	$('.changeBorderRight').click(function() {
		if (actualBorder == counterBorders) {
			actualBorder = 1;
		}
		else {
			actualBorder++;
		}
		$('.border-image').hide();
		$('#border-' + actualBorder).show();
	});
}

function cameraSuccess(imageData) {
	// Do something with the image
	//var image = document.getElementById('myImage');
	//image.src = "data:image/jpeg;base64," + imageData;
	
	$('#workPage').css('background-image','url(data:image/jpeg;base64,' + imageData + ')');
	$.mobile.changePage("#workPage");
	
	//$('#workPage').append('<img src="data:image/jpeg;base64,' + imageData + '" alt="" />');
	navigator.notification.alert('Picture taken successed');
}

function cameraError(message) {
	// Show a helpful message
	navigator.notification.alert(message);
	//alert(message);
}