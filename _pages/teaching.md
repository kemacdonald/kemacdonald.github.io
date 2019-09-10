---
layout: page
permalink: /teaching/
title: teaching
description: teaching experience and materials
years: [2019, 2018, 2017, 2016, 2015, 2014]
---

{% for y in page.years %}
  <h3 class="year">{{y}}</h3>
  {% bibliography -f teaching -q @*[year={{y}}]* %}
{% endfor %}