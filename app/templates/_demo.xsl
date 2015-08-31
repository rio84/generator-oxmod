<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:import href="../../template/demo.xsl"/>
  <xsl:import href="mod.xsl" />

  <xsl:output method="html" doctype-public="" encoding="UTF-8"/>
  <xsl:template match="/root">
    <html>
      <head>
        <meta name="data-spm" content="181"/>
        <xsl:call-template name="trip-header">
          <xsl:with-param name="title"><%=modName%> Demo</xsl:with-param>
        </xsl:call-template>
        <link rel="stylesheet" type="text/css" href="asset/index.css" />
      </head>
      <body>

        <xsl:call-template name="trip-nav" />
        <div class="layout">
          <xsl:call-template name="<%=modName%>" />
        </div>

        <xsl:call-template name="trip-footer">
          <xsl:with-param name="modjs"><%=modName%></xsl:with-param>
        </xsl:call-template>
      </body>

    </html>
  </xsl:template>

</xsl:stylesheet>
