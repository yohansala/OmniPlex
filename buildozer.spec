[app]

# (str) Title of your application
title = Calcul.PTEMDO

# (str) Package name
package.name = calculptemdo

# (str) Package domain (needed for android packaging)
package.domain = org.ptemdo

# (list) Source files to include (let it empty to include all the files)
source.include_exts = py,png,jpg,kv,atlas

# (list) Application requirements
requirements = python3,kivy

# (str) Supported orientations
orientation = portrait

# (str) Icon of the application
icon.filename = Calculogo.jpg

# (int) Target Android API, should be as high as possible.
android.api = 33

# (int) Minimum API your APK will support.
android.min_api = 21

# (bool) Use AndroidX
android.androidx = True

# (bool) Accept Android SDK licenses automatically
android.accept_sdk_license = True
