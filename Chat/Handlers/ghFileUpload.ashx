<%@ WebHandler Language="VB" Class="ghFileUpload" %>
Imports System.Web
Imports System.Web.Services
Imports System.Text.RegularExpressions
Imports Entities



Public Class ghFileUpload
    Implements System.Web.IHttpHandler

    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim response As New Dictionary(Of String, String)
        Dim _AttachmentID As Int64 = 0
        Dim _TodayDate As String = ""
        Dim Dir As IO.DirectoryInfo = Nothing
        _TodayDate = DateTime.Now.ToString("yyyy-MM-dd")
        Dim FilePath As String = ConfigurationManager.AppSettings("RootPath") + "\" + _TodayDate
        Try
            'Dim Dir As IO.DirectoryInfo = IO.Directory.CreateDirectory(ConfigurationManager.AppSettings("RootPath"))

            Dim files As HttpFileCollection = context.Request.Files
            For i As Int16 = 0 To files.Count - 1

                FilePath = System.IO.Path.Combine(ConfigurationManager.AppSettings("RootPath"), _TodayDate)

                If Not IO.Directory.Exists(FilePath) Then
                    Dir = IO.Directory.CreateDirectory(ConfigurationManager.AppSettings("RootPath") + "\" + _TodayDate)
                    files(i).SaveAs(Dir.FullName & "\" & IO.Path.GetFileName(files(i).FileName))
                Else

                    files(i).SaveAs(System.IO.Path.Combine(FilePath, IO.Path.GetFileName(files(i).FileName)))
                End If

                '  files(i).SaveAs(Dir.FullName & "\" & IO.Path.GetFileName(files(i).FileName))
                Using objEnt As New Entities
                    Dim objAtt As New ChatAttachments
                    Dim datestring As String = Regex.Replace(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.mmm "), "[^0-9\-]", "")
                    objAtt.FileName = IO.Path.GetFileName(files(i).FileName)
                    objAtt.FileNameX = Regex.Replace(datestring, "-", "")                       'Regex.Replace(datestring, "[^0-9\-]", "")
                    ' objAtt.FilePath = Dir.FullName
                    objAtt.FileSize = files(i).ContentLength
                    objAtt.CreatedOn = DateTime.Now
                    objEnt.ChatAttachments.Add(objAtt)
                    objEnt.SaveChanges()
                    _AttachmentID = objAtt.ChatAttachID

                End Using

            Next
            response.Add("err", "0")
            response.Add("message", "success")
            response.Add("AttachID", _AttachmentID)
        Catch ex As Exception
            response.Add("err", "1")
            response.Add("message", ex.Message)
            response.Add("AttachID", "0")
        End Try

        context.Response.ContentType = "application/json"
        Dim JSerializer As New Script.Serialization.JavaScriptSerializer
        context.Response.Write(JSerializer.Serialize(response))

    End Sub

    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class