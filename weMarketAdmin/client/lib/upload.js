var accessid = 'Vh0snNA4Orv3emBj';
var accesskey = 'd7p2eNO8GuMl1GtIZ0at4wPDyED4Nz';
var host = 'http://data.tiegushi.com';

var g_dirname = ''
var g_object_name = ''
var g_object_name_type = ''
var now = timestamp = Date.parse(new Date()) / 1000;

var policyText = {
	"expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
	"conditions": [
		["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
	]
};

function check_object_radio() {
	g_object_name_type = 'random_name';
}

function get_dirname() {
	g_dirname = '';
}

function random_string(len) {
	　　len = len || 32;
	　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	　　var maxPos = chars.length;
	　　var pwd = '';
	　　for (i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

function get_suffix(filename) {
	pos = filename.lastIndexOf('.')
	suffix = ''
	if (pos != -1) {
		suffix = filename.substring(pos)
	}
	return suffix;
}

function calculate_object_name(filename) {
	if (g_object_name_type == 'local_name') {
		g_object_name += "${filename}"
	}
	else if (g_object_name_type == 'random_name') {
		suffix = get_suffix(filename)
		g_object_name = g_dirname + random_string(10) + suffix
	}
	return ''
}

function get_uploaded_object_name(filename) {
	if (g_object_name_type == 'local_name') {
		tmp_name = g_object_name
		tmp_name = tmp_name.replace("${filename}", filename);
		return tmp_name
	}
	else if (g_object_name_type == 'random_name') {
		return g_object_name
	}
}

function set_upload_param(up, filename, ret) {
	var policyBase64 = Base64.encode(JSON.stringify(policyText))
	var message = policyBase64
	var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true });
	var signature = Crypto.util.bytesToBase64(bytes);

	g_object_name = g_dirname;
	if (filename != '') {
		suffix = get_suffix(filename)
		calculate_object_name(filename)
	}
	new_multipart_params = {
		'key': g_object_name,
		'policy': Base64.encode(JSON.stringify(policyText)),
		'OSSAccessKeyId': accessid,
		'success_action_status': '200', //让服务端返回200,不然，默认会返回204
		'signature': signature,
	};

	up.setOption({
		'url': host,
		'multipart_params': new_multipart_params
	});

	up.start();
}

createPlupload = function (id) {
	var uploader = new plupload.Uploader({
		runtimes: 'html5,flash,silverlight,html4',
		browse_button: id,
		// container: document.getElementById('container'),
		flash_swf_url: '/upload/Moxie.swf',
		silverlight_xap_url: '/upload/Moxie.xap',
		url: 'http://oss.aliyuncs.com',
		resize: {
			width: 800,
			height: 600,
			quality: 80,
		},


		init: {
			PostInit: function () {

			},

			FilesAdded: function (up, files) {
				// 设置session
				console.log(files[0]);
				Session.set('preUploadingImg',{
					id: files[0].id,
					name: files[0].name,
					size: plupload.formatSize(files[0].size),
					originSrc: files[0].getSource()
				})
				set_upload_param(uploader, '', false);
			},

			BeforeUpload: function (up, file) {
				check_object_radio();
				get_dirname();
				set_upload_param(up, file.name, true);
			},

			UploadProgress: function (up, file) {
				var $elem = $('#'+file.id);
				$elem.find('progress').html(file.percent +'%');
				console.log('uploading...');
			},

			FileUploaded: function (up, file, info) {
				var uploadedImages = Session.get('uploadedImages') || [];
				var log = '';
				if (info.status == 200)
				{
					log = 'upload to oss success, object name:' + get_uploaded_object_name(file.name) + ' 回调服务器返回的内容是:' + info.response;
					uploadedImages.push({
						id: file.id,
						imgUrl: host + '/' + get_uploaded_object_name(file.name)
					});
				}
				else if (info.status == 203)
				{
					log = '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response;
				}
				else
				{
					log = info.response;
				} 
				console.log(log);
				Session.set('uploadedImages',uploadedImages);
			},

			Error: function (up, err) {
				var log = '';
				if (err.code == -600) {
					log = "\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小";
				}
				else if (err.code == -601) {
					log = "\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型";
				}
				else if (err.code == -602) {
					log = "\n这个文件已经上传过一遍了";
				}
				else 
				{
					log = err.response;
				}
				console.log(log);
			}
		}
	});
	return uploader;
};

clearPluploadSession = function(){
	Session.set('preUploadingImg',null);
	Session.set('uploadedImages',[]);
}


