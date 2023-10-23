# README #

## * ANDROID 

* Configurar el query del metodo getRemoteLastVersion() del servicio src/app/services/API/config.api.service.ts 
```java 
    "query": `SELECT * FROM ... Id = 4`,
```

* Si da error de notification compact , usar "npx jetify", para corregir errores de compilacion.

* La libreria "@mauron85/cordova-plugin-background-geolocation", usado como alternativa para el tracker de geoposicionamiento, usa valores especiales que deben ser declarados en el archivo app/src/res/values/strings.xml 
```java
    <string name="mauron85_bgloc_account_name">@string/app_name</string>
    <string name="mauron85_bgloc_account_type">$PACKAGE_NAME.account</string>
    <string name="mauron85_bgloc_content_authority">$PACKAGE_NAME</string>
```

* Cada vez que se genera un proyecto Android debe sincronizar el proyecto con los archivos Gradle desde Android Studio, si presenta un error de tipo 'SDK location not found, Define location with an ANDROID_SDK_ROOT environment variable' 

* Para mantener solo la orientación portrait en Android colocar la propiedad android:screenOrientation="portrait" dentro del AndroidManifest.xml en <activity> 

## * ANDROID - HUAWEI APP GALLERY 

* Utilizar la rama master_hms

* Configurar el query del metodo getRemoteLastVersion() del servicio src/app/services/API/config.api.service.ts 
```java 
    "query": `SELECT * FROM ... Id = 5`,
``` 

* Copiar el archivo "agconnect-services.json" (src/assets/configs/) y pegarlo en el nuevo proyecto android/app/ 

* Configurar los archivos gradle.
* A nivel del proyecto (android/app/build.gradle) 
```java
    buildscript {
        repositories {
            ...
            maven { url 'https://developer.huawei.com/repo/' }
        }
        dependencies {
            ...
            // classpath 'com.google.gms:google-services:4.3.13'
            classpath 'com.huawei.agconnect:agcp:1.5.2.300'
        }
    }
    ...
    allprojects {
        repositories {
            ...
            maven { url 'https://developer.huawei.com/repo/' }
        }
    }
```
* A nivel de aplicación (android/app/build.gradle) 
```java
    ...
    apply plugin: 'com.huawei.agconnect'
    ...
    dependencies {
        ...
        implementation 'com.huawei.agconnect:agconnect-core:1.5.2.300'
    }
    ...
    ... 
    // try {
    //     def servicesJSON = file('google-services.json')
    //     if (servicesJSON.text) {
    //         apply plugin: 'com.google.gms.google-services'
    //     }
    // } catch(Exception e) {
    //     logger.info("google-services.json not found, google-services plugin not applied. Push Notifications won't work")
    // }
```

## * IOS 

* Configurar el query del metodo getRemoteLastVersion() del servicio src/app/services/API/config.api.service.ts 
```java 
    "query": `SELECT * FROM ... Id = 6`,
```