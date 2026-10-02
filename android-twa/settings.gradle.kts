// Yoshlar Base: Trusted Web Activity (TWA). PWA'ni (yoshlarbase.vercel.app) Android ilova sifatida ochadi.
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "yoshlarbase-twa"
include(":app")
