---
layout: page
permalink: /teaching/
title: teaching
description: > 
  For a formal statement about my teaching philosophy, see [<a href="https://google.com" style="color:#B509AC">here</a>].
years: [2019, 2018, 2017, 2016, 2015, 2014]
---

{% for y in page.years %}
  <h3 class="year">{{y}}</h3>
  {% bibliography -f teaching -q @*[year={{y}}]* %}
{% endfor %}