# Chart

## Concept
Le module chart a pour but de mieux découper les actions nécessaire à l'affichage d'un graphique

- Etre dynamique, reliés a des variables (et les observer)
- Faire une requête et en récupérer le résultat (a chaque fois que la requête change)
- Traduire ce résultat graphiquement

## Observer
Pour permettre cela, le chart peut être relier a des dynamic-parameters
### Exemple
```
  // Dans cette exemple le graphique changera a cas de selection d'une nouvelle date dans un datepicker ou d'un ensemble de siege social différent dans un selectbox
  "chart": {
    "dynamic-parameters": [
      "datepicker",
      "siege_social"
    ],
    "component": "echarts",
    ...
```
Ici pas d'autres réglage à effectuer, le chart observera la valeur de ses éléments, et appellera automatiquement ceux-ci pour modifier sa requête en cas de changement.
Pour plus d'information, regardez la documentation des dynamique parameters

## Requêter
Le format est très similaire a celui du query builder, cependant il ajoute quelques options suplémentaires.
Nous insisterons sur le point suplémentaire principal, les axis
```
"chart": {
  ...
  "component": "echarts",
  "request": {
    "data": {
      "fields": {
        "quantite": [
          "sum"
        ]
      }
    },
    "scale": {
      "fields": [
        "month",
        "year",
        "siege_social"
      ],
      "axis": {
       // Les axis permettent de définir comment la requete sera redécoupé, dans notre exemple on retrouvera sur l'axe x les données "temporelle" alors qu'on retrouver une courbe par siege_social différent
        "x": [
          "month",
          "year"
        ],
        "y": ["siege_social"]
      }
    },
    "evol": {
      "scale": "year"
    }
  }
```

## Afficher
Les paramètre qui nous intéresse ici sont "component" et "options"
```
"chart": {
  ...
  "component": "echarts",
  "request": ...,
  "options": {
    "title": {
      "text": "Nombre de visites mensuelles"
    }
  }
}
```
Via "component" , le module chart va chercher un composant graphique nommé "echarts", et lui donne toutes les infos nécessaires pour pouvoir afficher la donnée.

Les options sont des paramètre supplémentaires qui sont propre a chaque composants graphiques.

## Exemple complet

```
{
  "dynamic-parameters":["datepicker"],
  "component": "echarts",
  "request": {
    "data": {
      "fields": {
        "viste": [
          "sum"
        ]
      }
    },
    "scale": {
      "fields": [
        "year",
        "month",
        "category"
      ],
      "axis": {
        "x": [
          "month",
          "year"
        ],
        "y": [
          "category"
        ]
      }
    }
  },
  "options": {
    "title": {
      "text": "Nombre de visites mensuelles"
    }
  }
}
```
