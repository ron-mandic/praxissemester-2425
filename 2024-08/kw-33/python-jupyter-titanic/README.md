# Titanic Notebook

This notebook uses machine learning algorithms to get the best accuracy of predictions for who survived the sinking of the Titanic given the attributes in the dataset.

## Setup

- Install [Anaconda](https://www.anaconda.com/)
- Set the channel priority to strict to avoid issues with the environment creation taking forever.
  - `conda config --set channel_priority strict`
- Run the following commands (in either the terminal or an Anaconda Prompt):
  - `conda env create -f golden_scenario_env.yml`
  - `conda activate golden_scenario_env`
  - `conda install python=3.7`
- In VS Code, open the [Titanic.ipynb](Titanic.ipynb) file and connect to the golden_scenario_env kernel

You need to setup the environment as an `ipykernel` to use it from the Jupyter notebook. To do it run inside of the conda activated environment:

`python -m ipykernel install --user --name golden_scenario_env --display-name "Golden Scenario Env"`

Also if you want to support PDF export from jupyter you need to setup LaTeX:

`sudo apt-get install texlive-xetex texlive-fonts-recommended texlive-plain-generic`

## Installation

```bash
conda create -n golden_scenario_env python=3.7
conda activate golden_scenario_env
conda install numpy pandas scikit-learn matplotlib jupyter ipykernel
pip install tensorflow==2.8.0 keras==2.8.0
```

## Latest error

```text
c:\Users\<USER>\anaconda3\envs\golden_scenario_env\lib\site-packages\ipykernel_launcher.py:4: DeprecationWarning: `import pandas_profiling` is going to be deprecated by April 1st. Please use `import ydata_profiling` instead.
  after removing the cwd from sys.path.
---------------------------------------------------------------------------
TypeError                                 Traceback (most recent call last)
~\AppData\Local\Temp\ipykernel_22040\1512543305.py in <module>
     21 from sklearn.preprocessing import StandardScaler
     22 from sklearn.model_selection import GridSearchCV
---> 23 from keras.wrappers.scikit_learn import KerasClassifier
     24 from keras.models import Sequential
     25 from keras.layers import Dense, Activation, Dropout

c:\Users\Ron\anaconda3\envs\golden_scenario_env\lib\site-packages\keras\__init__.py in <module>
     19 """
     20 # pylint: disable=unused-import
---> 21 from tensorflow.python import tf2
     22 from keras import distribute
     23

c:\Users\Ron\anaconda3\envs\golden_scenario_env\lib\site-packages\tensorflow\__init__.py in <module>
     35 import typing as _typing
     36
---> 37 from tensorflow.python.tools import module_util as _module_util
     38 from tensorflow.python.util.lazy_loader import LazyLoader as _LazyLoader
     39

c:\Users\Ron\anaconda3\envs\golden_scenario_env\lib\site-packages\tensorflow\python\__init__.py in <module>
     35
...
If you cannot immediately regenerate your protos, some other possible workarounds are:
 1. Downgrade the protobuf package to 3.20.x or lower.
 2. Set PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python (but this will use pure-Python parsing and will be much slower).

More information: https://developers.google.com/protocol-buffers/docs/news/2022-05-06#python-updates
Output is truncated. View as a scrollable element or open in a text editor. Adjust cell output settings...
```
