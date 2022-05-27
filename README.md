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

Also you can use a package data:
<details>
<summary>Package example:</summary>
<p>

```xml
<filters-list>
	<filters tag="one random tag with his name and value will be presented in response xml">
		<issId>782490</issId>
		<date>2022-05-25</date>
		<dateType>ACTUAL</dateType>
		<official>false</official>
		<fields>
			<field>id_iss</field>
			<field>TIME</field>
			<field>LAST</field>
			<field>VOL_ACC</field>
			<field>DEAL_ACC</field>
		</fields>
	</filters>
	<filters>
		<issId>782483</issId>
		<date>2022-05-25</date>
		<dateType>ACTUAL</dateType>
		<official>false</official>
		<fields>
			<field>id_iss</field>
			<field>TIME</field>
			<field>LAST</field>
			<field>VOL_ACC</field>
			<field>DEAL_ACC</field>
		</fields>
	</filters>
</filters-list>
```

</p>
</details>

Each api route use his own request xml depending on required params.

Steps:

1. Read xml from database and convert it to js object via fast-xml-parser or other library
2. Request data with this params from api[methodName]
3. Return xml data