/**
{
  all: [
    {
      hash: '70d5125e6f9db810cb6851acf04ff28f0b8b9a88',
      date: '2022-12-05T21:28:08-08:00',
      message: 'switch to module',
      refs: 'HEAD -> main',
      body: '',
      author_name: 'Brandon Saunders',
      author_email: 'BrandonNSaunders@gmail.com'
    }
  ],
  latest: {
    hash: '70d5125e6f9db810cb6851acf04ff28f0b8b9a88',
    date: '2022-12-05T21:28:08-08:00',
    message: 'switch to module',
    refs: 'HEAD -> main',
    body: '',
    author_name: 'Brandon Saunders',
    author_email: 'BrandonNSaunders@gmail.com'
  },
  total: 1
}
 */

import simpleGit  from 'simple-git';


export async function getCommits() {
    const commits = await simpleGit().log();
    console.log(commits);
    return commits;
}