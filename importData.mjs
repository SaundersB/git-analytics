export async function importCommits(db, commits) {
    
    console.log(`Importing ${commits.length} commits`)
    commits.map(async (commit) => {
        let storedAuthor = await db.get('SELECT * FROM authors WHERE email = ?;', commit.committer.email);
        console.log(`author`, storedAuthor)

        if(!storedAuthor) {
            await db.run(
                'INSERT INTO authors (name, email, createDate) VALUES (?, ?, ?);', 
                commit.committer.name, 
                commit.committer.email, 
                commit.committer.date
            )
            storedAuthor = await db.get('SELECT * FROM authors WHERE email = ?;', commit.committer.email);
        }

        const storedCommit = await db.get(`SELECT * FROM commits WHERE commitId = ?`, commit.commitId)

        if(!storedCommit) {
            await db.run(
                'INSERT INTO commits (commitId, authorId, comment, addChanges, editChanges, deleteChanges, url, remoteUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?);', 
                commit.commitId, 
                storedAuthor.id,
                commit.comment, 
                commit.changeCounts.Add,
                commit.changeCounts.Edit,
                commit.changeCounts.Delete,
                commit.url,
                commit.remoteUrl
            )        
        }
    })

}
