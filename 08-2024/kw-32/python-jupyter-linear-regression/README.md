## [Video](https://youtu.be/bmmQA8A-yUA)

## Installation

```bash
> conda create --name lunartech_env
> conda activate lunartech_env
> conda install pandas numpy matplotlib seaborn scipy statsmodels scikit-learn
> code .
```

## Hinweis

Für die Ersteinrichtung muss VSCode noch `ipykernel` installieren, nachdem der Kernel der Umgebung, hier `lunartech_env` genannt, in VSCode ausgewählt wurde. Danach können alle Commands, die im Notebook eingetragen sind, mit dem Play-Button ausgeführt werden.

Führe hierfür [LinearRegression_CaseStudy_LunarTech.ipynb](LinearRegression_CaseStudy_LunarTech.ipynb) aus, weil hier noch Codeanpassungen gemacht werden mussten, damit es lokal lauffähig sein konnte.

## Erstellung der YAML-Datei

```bash
> conda env export --name lunartech_env > environment.yml
```

## Einrichtung der Umgebung mit der YAML-Datei

```bash
> conda env update --name lunartech_env --file environment.yml
```
