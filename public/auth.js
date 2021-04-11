function isloggedon(callback) {
	fetch("../api/user/me", {
		headers: {
			token: localStorage.getItem("token"),
		},
		method: "GET",
	}).then((response) => {
		response.text().then((resjson) => {
			var res = JSON.parse(resjson);
			if (response.ok) {
				return callback({
					valid: true,
					status: 200,
					message: res.message,
				});
			} else if (response.status == 400 && typeof token === "undefined") {
				return callback({
					valid: false,
					status: 401,
				});
			} else if (response.status == 400 && !(typeof token === "undefined")) {
				return callback({
					valid: false,
					status: 400,
				});
			} else {
				console.log(response.status);
			}
		});
	});
}
