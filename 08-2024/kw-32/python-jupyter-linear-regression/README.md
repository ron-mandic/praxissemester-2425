# Setup

## [Video](https://youtu.be/bmmQA8A-yUA)

## Installation

```bash
> conda init zsh
...
(base) conda create --name lunartech_env
(base) conda activate lunartech_env
(lunartech_env) conda install pandas numpy matplotlib seaborn scipy statsmodels scikit-learn
(lunartech_env) code .
```

## Hinweis

Für die Ersteinrichtung muss VSCode noch `ipykernel` installieren, nachdem der Kernel der Umgebung, hier `lunartech_env` genannt, in VSCode ausgewählt wurde. Danach können alle Commands, die im Notebook eingetragen sind, mit dem Play-Button ausgeführt werden.

Führe hierfür [LinearRegression_CaseStudy_LunarTech.ipynb](LinearRegression_CaseStudy_LunarTech.ipynb) aus, weil hier noch Codeanpassungen gemacht werden mussten, damit es lokal lauffähig sein konnte.

## Erstellung der YAML-Datei

```bash
> conda env export --name lunartech_env > environment_<architecture>.yml
```

## Einrichtung der Umgebung mit der YAML-Datei

```bash
> conda env update --name lunartech_env --file environment_<architecture>.yml
```

### Fehler

Es liegt höchstwahrscheinlich daran, dass die YAML-Datei speziell für die Windows-Umgebung geschrieben wurde. Vermutlich gibt es andere Spezifikationen für ein UNIX-basiertes oder ähnliches Betriebssystem wie macOS. Es werden auch ARM-64-Versionen der Packages benötigt, weshalb es eben zu diesen Fehlern kommt.

```bash
Channels:
 - conda-forge
 - defaults
Platform: osx-arm64
Collecting package metadata (repodata.json): done
Solving environment: failed
Channels:
 - conda-forge
 - defaults
Platform: osx-arm64
Collecting package metadata (repodata.json): done
Solving environment: failed

LibMambaUnsatisfiableError: Encountered problems while solving:
  - nothing provides requested zstd ==1.5.5 hd43e919_2
  - nothing provides requested zlib ==1.2.13 h2466b09_6
  - nothing provides requested zeromq ==4.3.5 he0c23c2_3
  - nothing provides requested xz ==5.4.6 h8cc25b3_1
  - nothing provides requested wheel ==0.43.0 py312haa95532_0
  - nothing provides requested vs2015_runtime ==14.40.33810 h3bf8584_20
  - nothing provides requested vc14_runtime ==14.40.33810 ha82c5b3_20
  - nothing provides requested vc ==14.40 h2eaa2aa_0
  - nothing provides requested unicodedata2 ==15.1.0 py312h2bbff1b_0
  - nothing provides requested ucrt ==10.0.22621.0 h57928b3_0
  - nothing provides requested tornado ==6.4.1 py312h827c3e9_0
  - nothing provides requested tk ==8.6.14 h0416ee5_0
  - nothing provides requested threadpoolctl ==3.5.0 py312hfc267ef_0
  - nothing provides requested tbb ==2021.8.0 h59b6b97_0
  - nothing provides requested statsmodels ==0.14.2 py312h4b0e54e_0
  - nothing provides requested sqlite ==3.45.3 h2bbff1b_0
  - nothing provides requested sip ==6.7.12 py312hd77b12b_0
  - nothing provides requested setuptools ==72.1.0 py312haa95532_0
  - nothing provides requested seaborn ==0.13.2 py312haa95532_0
  - nothing provides requested scipy ==1.13.1 py312hbb039d4_0
  - nothing provides requested scikit-learn ==1.5.1 py312h0158946_0
  - nothing provides requested qt-main ==5.15.2 h19c9488_10
  - nothing provides requested pyzmq ==26.1.0 py312hd7027bb_0
  - nothing provides requested pywin32 ==306 py312h53d5487_2
  - nothing provides requested pytz ==2024.1 py312haa95532_0
  - nothing provides requested python-dateutil ==2.9.0post0 py312haa95532_2
  - nothing provides requested python ==3.12.3 h2628c8c_0_cpython
  - nothing provides requested pyqt5-sip ==12.13.0 py312h2bbff1b_0
  - nothing provides requested pyqt ==5.15.10 py312hd77b12b_0
  - nothing provides requested pyparsing ==3.0.9 py312haa95532_0
  - nothing provides requested psutil ==6.0.0 py312h4389bb4_0
  - nothing provides requested ply ==3.11 py312haa95532_1
  - nothing provides requested pip ==24.0 py312haa95532_0
  - nothing provides requested pillow ==10.4.0 py312h827c3e9_0
  - nothing provides requested patsy ==0.5.6 py312haa95532_0
  - nothing provides requested pandas ==2.2.2 py312h0158946_0
  - nothing provides requested packaging ==24.1 py312haa95532_0
  - nothing provides requested openssl ==3.3.1 h2466b09_2
  - nothing provides requested openjpeg ==2.5.2 hae555c5_0
  - nothing provides requested numpy-base ==1.26.4 py312h4dde369_0
  - nothing provides requested numpy ==1.26.4 py312hfd52020_0
  - nothing provides requested numexpr ==2.8.7 py312h96b7d27_0
  - nothing provides requested mkl_random ==1.2.4 py312h59b6b97_0
  - nothing provides requested mkl_fft ==1.3.8 py312h2bbff1b_0
  - nothing provides requested mkl-service ==2.4.0 py312h2bbff1b_1
  - nothing provides requested mkl ==2023.1.0 h6b88ed4_46358
  - nothing provides requested matplotlib-base ==3.8.4 py312hc7c4135_0
  - nothing provides requested matplotlib ==3.8.4 py312haa95532_0
  - nothing provides requested lz4-c ==1.9.4 h2bbff1b_1
  - nothing provides requested libzlib ==1.2.13 h2466b09_6
  - nothing provides requested libwebp-base ==1.3.2 h2bbff1b_0
  - nothing provides requested libtiff ==4.5.1 hd77b12b_0
  - nothing provides requested libsqlite ==3.46.0 h2466b09_0
  - nothing provides requested libsodium ==1.0.18 h8d14728_1
  - nothing provides requested libpq ==12.17 h906ac69_0
  - nothing provides requested libpng ==1.6.39 h8cc25b3_0
  - nothing provides requested libffi ==3.4.4 hd77b12b_1
  - nothing provides requested libexpat ==2.6.2 h63175ca_0
  - nothing provides requested libdeflate ==1.17 h2bbff1b_1
  - nothing provides requested libclang13 ==14.0.6 default_h8e68704_1
  - nothing provides requested libclang ==14.0.6 default_hb5a9fac_1
  - nothing provides requested libbrotlienc ==1.0.9 h2bbff1b_8
  - nothing provides requested libbrotlidec ==1.0.9 h2bbff1b_8
  - nothing provides requested libbrotlicommon ==1.0.9 h2bbff1b_8
  - nothing provides requested lerc ==3.0 hd77b12b_0
  - nothing provides requested lcms2 ==2.12 h83e58a3_0
  - nothing provides requested krb5 ==1.20.1 h5b6d351_0
  - nothing provides requested kiwisolver ==1.4.4 py312hd77b12b_0
  - nothing provides requested jupyter_core ==5.7.2 py312h2e8e312_0
  - nothing provides requested jpeg ==9e h827c3e9_3
  - nothing provides requested joblib ==1.4.2 py312haa95532_0
  - nothing provides __win needed by ipython-8.26.0-pyh7428d3b_0
  - nothing provides __win needed by ipykernel-6.29.5-pyh4bbf305_0
  - nothing provides requested intel-openmp ==2023.1.0 h59b6b97_46320
  - nothing provides requested icu ==73.1 h6c2663c_0
  - nothing provides requested icc_rt ==2022.1.0 h6049295_2
  - nothing provides requested freetype ==2.12.1 ha860e81_0
  - nothing provides requested fonttools ==4.51.0 py312h2bbff1b_0
  - nothing provides requested expat ==2.6.2 hd77b12b_0
  - nothing provides requested debugpy ==1.8.5 py312h275cf98_0
  - nothing provides requested contourpy ==1.2.0 py312h59b6b97_0
  - nothing provides requested ca-certificates ==2024.7.4 h56e8100_0
  - nothing provides requested bzip2 ==1.0.8 h2bbff1b_6
  - nothing provides requested brotli-bin ==1.0.9 h2bbff1b_8
  - nothing provides requested brotli ==1.0.9 h2bbff1b_8
  - nothing provides requested bottleneck ==1.3.7 py312he558020_0
  - nothing provides requested blas ==1.0 mkl

Could not solve for environment specs
The following packages are incompatible
├─ blas ==1.0 mkl does not exist (perhaps a typo or a missing channel);
├─ bottleneck ==1.3.7 py312he558020_0 does not exist (perhaps a typo or a missing channel);
├─ brotli-bin ==1.0.9 h2bbff1b_8 does not exist (perhaps a typo or a missing channel);
├─ brotli ==1.0.9 h2bbff1b_8 does not exist (perhaps a typo or a missing channel);
├─ bzip2 ==1.0.8 h2bbff1b_6 does not exist (perhaps a typo or a missing channel);
├─ ca-certificates ==2024.7.4 h56e8100_0 does not exist (perhaps a typo or a missing channel);
├─ contourpy ==1.2.0 py312h59b6b97_0 does not exist (perhaps a typo or a missing channel);
├─ debugpy ==1.8.5 py312h275cf98_0 does not exist (perhaps a typo or a missing channel);
├─ expat ==2.6.2 hd77b12b_0 does not exist (perhaps a typo or a missing channel);
├─ fonttools ==4.51.0 py312h2bbff1b_0 does not exist (perhaps a typo or a missing channel);
├─ freetype ==2.12.1 ha860e81_0 does not exist (perhaps a typo or a missing channel);
├─ icc_rt ==2022.1.0 h6049295_2 does not exist (perhaps a typo or a missing channel);
├─ icu ==73.1 h6c2663c_0 does not exist (perhaps a typo or a missing channel);
├─ intel-openmp ==2023.1.0 h59b6b97_46320 does not exist (perhaps a typo or a missing channel);
├─ ipykernel ==6.29.5 pyh4bbf305_0 is not installable because it requires
│  └─ __win, which is missing on the system;
├─ ipython ==8.26.0 pyh7428d3b_0 is not installable because it requires
│  └─ __win, which is missing on the system;
├─ joblib ==1.4.2 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ jpeg ==9e h827c3e9_3 does not exist (perhaps a typo or a missing channel);
├─ jupyter_core ==5.7.2 py312h2e8e312_0 does not exist (perhaps a typo or a missing channel);
├─ kiwisolver ==1.4.4 py312hd77b12b_0 does not exist (perhaps a typo or a missing channel);
├─ krb5 ==1.20.1 h5b6d351_0 does not exist (perhaps a typo or a missing channel);
├─ lcms2 ==2.12 h83e58a3_0 does not exist (perhaps a typo or a missing channel);
├─ lerc ==3.0 hd77b12b_0 does not exist (perhaps a typo or a missing channel);
├─ libbrotlicommon ==1.0.9 h2bbff1b_8 does not exist (perhaps a typo or a missing channel);
├─ libbrotlidec ==1.0.9 h2bbff1b_8 does not exist (perhaps a typo or a missing channel);
├─ libbrotlienc ==1.0.9 h2bbff1b_8 does not exist (perhaps a typo or a missing channel);
├─ libclang13 ==14.0.6 default_h8e68704_1 does not exist (perhaps a typo or a missing channel);
├─ libclang ==14.0.6 default_hb5a9fac_1 does not exist (perhaps a typo or a missing channel);
├─ libdeflate ==1.17 h2bbff1b_1 does not exist (perhaps a typo or a missing channel);
├─ libexpat ==2.6.2 h63175ca_0 does not exist (perhaps a typo or a missing channel);
├─ libffi ==3.4.4 hd77b12b_1 does not exist (perhaps a typo or a missing channel);
├─ libpng ==1.6.39 h8cc25b3_0 does not exist (perhaps a typo or a missing channel);
├─ libpq ==12.17 h906ac69_0 does not exist (perhaps a typo or a missing channel);
├─ libsodium ==1.0.18 h8d14728_1 does not exist (perhaps a typo or a missing channel);
├─ libsqlite ==3.46.0 h2466b09_0 does not exist (perhaps a typo or a missing channel);
├─ libtiff ==4.5.1 hd77b12b_0 does not exist (perhaps a typo or a missing channel);
├─ libwebp-base ==1.3.2 h2bbff1b_0 does not exist (perhaps a typo or a missing channel);
├─ libzlib ==1.2.13 h2466b09_6 does not exist (perhaps a typo or a missing channel);
├─ lz4-c ==1.9.4 h2bbff1b_1 does not exist (perhaps a typo or a missing channel);
├─ matplotlib-base ==3.8.4 py312hc7c4135_0 does not exist (perhaps a typo or a missing channel);
├─ matplotlib ==3.8.4 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ mkl-service ==2.4.0 py312h2bbff1b_1 does not exist (perhaps a typo or a missing channel);
├─ mkl ==2023.1.0 h6b88ed4_46358 does not exist (perhaps a typo or a missing channel);
├─ mkl_fft ==1.3.8 py312h2bbff1b_0 does not exist (perhaps a typo or a missing channel);
├─ mkl_random ==1.2.4 py312h59b6b97_0 does not exist (perhaps a typo or a missing channel);
├─ numexpr ==2.8.7 py312h96b7d27_0 does not exist (perhaps a typo or a missing channel);
├─ numpy-base ==1.26.4 py312h4dde369_0 does not exist (perhaps a typo or a missing channel);
├─ numpy ==1.26.4 py312hfd52020_0 does not exist (perhaps a typo or a missing channel);
├─ openjpeg ==2.5.2 hae555c5_0 does not exist (perhaps a typo or a missing channel);
├─ openssl ==3.3.1 h2466b09_2 does not exist (perhaps a typo or a missing channel);
├─ packaging ==24.1 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ pandas ==2.2.2 py312h0158946_0 does not exist (perhaps a typo or a missing channel);
├─ patsy ==0.5.6 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ pillow ==10.4.0 py312h827c3e9_0 does not exist (perhaps a typo or a missing channel);
├─ pip ==24.0 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ ply ==3.11 py312haa95532_1 does not exist (perhaps a typo or a missing channel);
├─ psutil ==6.0.0 py312h4389bb4_0 does not exist (perhaps a typo or a missing channel);
├─ pyparsing ==3.0.9 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ pyqt5-sip ==12.13.0 py312h2bbff1b_0 does not exist (perhaps a typo or a missing channel);
├─ pyqt ==5.15.10 py312hd77b12b_0 does not exist (perhaps a typo or a missing channel);
├─ python-dateutil ==2.9.0post0 py312haa95532_2 does not exist (perhaps a typo or a missing channel);
├─ python ==3.12.3 h2628c8c_0_cpython does not exist (perhaps a typo or a missing channel);
├─ pytz ==2024.1 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ pywin32 ==306 py312h53d5487_2 does not exist (perhaps a typo or a missing channel);
├─ pyzmq ==26.1.0 py312hd7027bb_0 does not exist (perhaps a typo or a missing channel);
├─ qt-main ==5.15.2 h19c9488_10 does not exist (perhaps a typo or a missing channel);
├─ scikit-learn ==1.5.1 py312h0158946_0 does not exist (perhaps a typo or a missing channel);
├─ scipy ==1.13.1 py312hbb039d4_0 does not exist (perhaps a typo or a missing channel);
├─ seaborn ==0.13.2 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ setuptools ==72.1.0 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ sip ==6.7.12 py312hd77b12b_0 does not exist (perhaps a typo or a missing channel);
├─ sqlite ==3.45.3 h2bbff1b_0 does not exist (perhaps a typo or a missing channel);
├─ statsmodels ==0.14.2 py312h4b0e54e_0 does not exist (perhaps a typo or a missing channel);
├─ tbb ==2021.8.0 h59b6b97_0 does not exist (perhaps a typo or a missing channel);
├─ threadpoolctl ==3.5.0 py312hfc267ef_0 does not exist (perhaps a typo or a missing channel);
├─ tk ==8.6.14 h0416ee5_0 does not exist (perhaps a typo or a missing channel);
├─ tornado ==6.4.1 py312h827c3e9_0 does not exist (perhaps a typo or a missing channel);
├─ ucrt ==10.0.22621.0 h57928b3_0 does not exist (perhaps a typo or a missing channel);
├─ unicodedata2 ==15.1.0 py312h2bbff1b_0 does not exist (perhaps a typo or a missing channel);
├─ vc14_runtime ==14.40.33810 ha82c5b3_20 does not exist (perhaps a typo or a missing channel);
├─ vc ==14.40 h2eaa2aa_0 does not exist (perhaps a typo or a missing channel);
├─ vs2015_runtime ==14.40.33810 h3bf8584_20 does not exist (perhaps a typo or a missing channel);
├─ wheel ==0.43.0 py312haa95532_0 does not exist (perhaps a typo or a missing channel);
├─ xz ==5.4.6 h8cc25b3_1 does not exist (perhaps a typo or a missing channel);
├─ zeromq ==4.3.5 he0c23c2_3 does not exist (perhaps a typo or a missing channel);
├─ zlib ==1.2.13 h2466b09_6 does not exist (perhaps a typo or a missing channel);
└─ zstd ==1.5.5 hd43e919_2 does not exist (perhaps a typo or a missing channel).
```
