fetch(`https://discord.com/api/v8/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}/messages/813418848015351818`, {
	method: "PATCH",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify(embed),
})
	.then(res => res.json())
	.then(json => console.log(json));