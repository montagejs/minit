### v0.5.4

 - Add bundle information to application templates for mop
 - Update application icon for new montagejs logo
 - Update digit icons
 - Add support for bookmaking the application to the home screen on iOS andAndroid

### v0.4.3

 - serve
   Update to Joey 1.3.3 so that we can handle audio range requests.
 - Travis.ci config
   Tune irc notifications

### v0.4.2

 - Montage v0.13.9

### v0.4.1

 - Montage v0.13.8
 - Digit v0.4.0

### v0.4.0

 - create:digit
   * Update homescreen icons
   * Add to homescreen support for Chrome Beta on Android
   * Improve icons for iOS 7
 - create:app
   * Remove the welcome component
 - Fix typos in usage screen
 - Fix Montage logo path (Tim Statler <@tstatler>)
 - Programmatic API now returns the final path of the created result

### v0.3.10

 - Fix issues with minit serve -i not following symlinks #57
 - Fix path to the svg logo in the generated app template

### v0.3.8

 - Return a promise for the config object from `create`, which contains
   information such as the destination directory and sanitized name
 - Fix issues with `npm` not running well multiple times in the same process
 - Update `app` template to use short charset declaration
 - Ensure generated component `data-montage-id`s start with a lowercase letter
 - Ensure `test` directories in templates are published

### v0.3.7

 - Update dependency versions of `app` and `digit` templates

### v0.3.6

 - Fix generating template on different source and destination devices/drives

### v0.3.5

 - Add diacritics to convert unicode names to ASCII when needed
 - Don't permit accented characters in package names
 - Fix issues with name conversion
 - Fail earlier and more cleanly when missing arguments to commands
 - Correct module template to accept exportId
 - Output local URL from `minit serve`

### v0.3.4

 - Remove Hello World text from Digit template

### v0.3.3

 - Montage v0.13.1

### v0.3.2

 - Update Q from 0.9.2 to 0.9.6

### v0.3.1

- Correct link to quick start

## v0.3.0

 - Updates for Montage v0.13
