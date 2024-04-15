export async function GET(request, { params }) {
	try {		
		let response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `grant_type=client_credentials&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}`
		});

		let result = await response.json();

		console.log(result);

		response = await fetch('https://api.linkedin.com/v2/recommendation?q=recipient&statusFilters=List(VISIBLE)', {
			headers: {
				'Authorization': `Bearer ${result.access_token}`
			}
		});

		result = await response.json();

		console.log(result);

		return Response.json(result);
	} catch (err) {
		console.log(err);
		return new Response(err.message, { status: 500 });
	}
}