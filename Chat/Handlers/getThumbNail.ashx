<%@ WebHandler Language="VB" Class="getThumbNail" %>

Imports System
Imports System.Web

Public Class getThumbNail : Implements IHttpHandler

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim fileName As String = context.Request.QueryString("file")
        Dim filePath As String
        Dim _TodayDate As String = ""
        _TodayDate = DateTime.Now.ToString("yyyy-MM-dd")
        context.Response.ClearHeaders()

        Select Case IO.Path.GetExtension(fileName).ToLower
            Case ".jpg", ".jpeg", ".png"
                'filePath = IO.Path.Combine(ConfigurationManager.AppSettings("RootPath") & "\" & fileName)
                filePath = IO.Path.Combine(ConfigurationManager.AppSettings("RootPath") & "\" & _TodayDate & "\" & fileName)
            Case ".xls", ".xlsx", ".xlsm", ".xltx"
                filePath = "images/ico/excel.png"
            Case ".doc", ".docx"
                filePath = "images/ico/word.png"
            Case ".pdf"
                filePath = "images/ico/pdf.png"
            Case ".ppt", ".pptx", ".pptm"
                filePath = "images/ico/powerpoint.png"
            Case ".txt"
                filePath = "images/ico/txt.png"
            Case ".zip"
                filePath = "images/ico/zip.png"
            Case ".rar"
                filePath = "images/ico/rar.png"
            Case ".mp3"
                filePath = "images/ico/mp3.png"
            Case ".mp4"
                filePath = "images/ico/mp4.png"
            Case Else
                filePath = "images/ico/default.png"
        End Select

        context.Response.AddHeader("content-disposition", "inline;filename=" & fileName)
        context.Response.ContentType = "image/jpeg"
        context.Response.TransmitFile(filePath)

        context.Response.Flush()
    End Sub

    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class