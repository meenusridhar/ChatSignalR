<%@ WebHandler Language="VB" Class="ghFileDownload" %>

Imports System.Web
Imports System.Web.Services

Public Class ghFileDownload
    Implements System.Web.IHttpHandler

    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim fileName As String = context.Request.QueryString("file")
        Dim _TodayDate As String = ""
        _TodayDate = DateTime.Now.ToString("yyyy-MM-dd")
        Dim filePath As String = IO.Path.Combine(ConfigurationManager.AppSettings("RootPath") & "\" & _TodayDate & "\" & fileName)

        context.Response.ClearHeaders()

        Select Case IO.Path.GetExtension(fileName)
            Case ".jpg", ".jpeg"
                context.Response.AddHeader("content-disposition", "inline;filename=" & fileName)
                context.Response.ContentType = "image/jpeg"
            Case ".png"
                context.Response.AddHeader("content-disposition", "inline;filename=" & fileName)
                context.Response.ContentType = "image/png"
            Case ".pdf"
                context.Response.AddHeader("content-disposition", "inline;filename=" & fileName)
                context.Response.ContentType = "application/pdf"
            Case ".ppt"
                context.Response.AddHeader("content-disposition", "attachment;filename=" & fileName)
                context.Response.ContentType = "application/vnd.ms-powerpoint"
            Case ".pptx"
                context.Response.AddHeader("content-disposition", "attachment;filename=" & fileName)
                context.Response.ContentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            Case Else
                context.Response.AddHeader("content-disposition", "attachment;filename=" & fileName)
                context.Response.ContentType = "application/octet-stream"
        End Select

        context.Response.TransmitFile(filePath)

        context.Response.Flush()
    End Sub

    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class