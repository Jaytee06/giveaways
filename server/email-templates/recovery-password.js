module.exports = (data = {}) =>
	`
			<h1>Link for password recovery:</h1>
			<a href="${data.url}?token=${data.recoveryToken}">Recovery password</a>
		`;
