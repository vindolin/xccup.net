# Todo

## Progress

- [x] Prevent the upload of an already existing igc
- [ ] Option to display error log in admin view
- [x] API compression with https://github.com/expressjs/compression
- [x] ~~Add a prop to Flight that indicates if the flight is editable (14 days limit)~~ Will be achived by comparing takeoffTime to current date
- [ ] Use node cluster for scoring to prevent slow API response during results calculation
- [ ] Find a way to add links to news items without injecting html (List of links with title?)
- [ ] Create different sizes of flight photos. The client can than choose depending on its viewport size
- [ ] Add flags to flight that indicates if it has a report, photos or comments
- [ ] Use "convict" for better handling of env vars
- [ ] Prevent server crashing if DB is shut down
- [ ] If no season details are present, use the ones fron the previous season?
- [ ] Dynamic stripping of flight fixes. A minimum resolution should always be given.

### Production

- [ ] Backup strategy
