# rudata

Interfax api data processing

Get xml string, return xml string

filters param in api request methods is postprocessed with fast-xml-parser xml data like:

<details>
<summary>Example:</summary>
<p>

```xml
<filters>
	<official>false</official>
	<codes>
		<code>US0378331005</code>
		<code>US0378331004</code>
	</codes>
	<dateFrom>2022-03-30</dateFrom>
	<dateTo>2022-03-30</dateTo>
	<fields>
		<field>MPRICE</field>
		<field>LCLOSE</field>
		<field>DISCOUNT</field>
	</fields>
</filters>
```

</p>
</details>

Each api route use his own request xml depending on required params.

Steps:

1. Read xml from database and convert it to js object via fast-xml-parser or other library
2. Request data with this params from api[methodName]
3. Return xml data