USE THIS APPROACH: FORK
=======================

For normal development:

1. Merge upstream from upstream to personal local fork
2. Push merge changes to personal remote fork
3. Create local feature branch on personal fork
4. Publish local feature branch to personal remote fork

.. make changes

5. Don’t merge back into develop for personal fork
6. Issue a pull request to upstream develop from feature branch on personal fork
7. Accept pull request on upstream develop
8. Merge upstream from upstream to personal local fork
9. Push merge changes to personal remote fork
10. Kill feature branches on remote fork

For release:

1. Create release branch from local upstream develop
2. Push release branch to upstream release branch

… perform verification testing

3. Finish release by merging into upstream master and develop
4. Create release tag

For hot fixes:

1. Create upstream hot fix branch from master
2. Create local hot fix branch from upstream remote hot fix branch
3. Connect local hot fix branch to personal remote hot fix branch

… make changes

4. Issue a pull request to upstream hot fix branch
5. Accept pull request on upstream hot fix branch

… deploy to staging for testing

6a. Merge upstream hot fix branch to develop
6b. Merge upstream hot fix branch to master

7. Kill branch on personal fork, local and remote


DO NOT USE THIS APPROACH: NO FORK
=================================

For normal development:

1. Create feature branch to local
2. Publish feature branch to remote

… make changes

3. Issue a pull request from feature branch to develop
4. Accept pull request on upstream develop
5. Kill feature branches on local and remote

For release:

1. Create release branch from local develop
2. Push release branch to upstream branch

… perform verification testing

3. Finish release by merging into upstream master and develop
4. Create release tag

For hot fixes:

1. Create local hot fix branch on local
2. Publish hot fix branch on upstream

… make changes

3. Push to remote upstream hot fix branch

… deploy to staging for testing

3a. Issue a pull request to upstream master branch
3b. Issue a pull request to upstream develop branch
4a. Accept pull request on upstream master branch
4b. Accept pull request on upstream develop branch

5. Tag hotfix

… deploy to production

6. Kill hotfix branch


