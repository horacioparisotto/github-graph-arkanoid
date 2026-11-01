export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN not configured' });
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          user(login: "horacioparisotto") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }`,
      }),
    });

    const data = await response.json();
    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    const total = calendar.totalContributions;
    const weeks = calendar.weeks.map(week => week.contributionDays.map(day => ({
      date: day.date,
      count: day.contributionCount,
    })));
    const fetchedAt = new Date().toISOString();

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ total, weeks, fetchedAt });
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error);
    return res.status(500).json({ error: 'Failed to fetch contributions' });
  }
}
