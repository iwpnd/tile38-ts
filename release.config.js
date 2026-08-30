module.exports = {
    branches: [
        'main',
        { name: 'beta', prerelease: true },
        { name: 'alpha', prerelease: true },
    ],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'conventionalcommits',
                releaseRules: [
                    { type: 'docs', release: 'patch' },
                    { type: 'perf', release: 'patch' },
                    { type: 'chore', scope: 'deps', release: 'patch' },
                ],
            },
        ],
        ['@semantic-release/release-notes-generator'],
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
            },
        ],
        '@semantic-release/npm',
        [
            '@semantic-release/git',
            {
                assets: ['package.json', 'CHANGELOG.md'],
                message: 'chore(release): ${nextRelease.version} [skip ci]',
            },
        ],
        '@semantic-release/github',
    ],
};
