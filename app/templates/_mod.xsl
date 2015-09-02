<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/root" name="<%=modName%>">
    <!-- className 'J_OXMod' required  -->
    <div class="J_OXMod oxmod-<%=modName%>" ox-mod="<%=modName%>">

      <h1>
        This is mod <%=modName%>;
      </h1>
      </div>
    </xsl:template>

</xsl:stylesheet>
