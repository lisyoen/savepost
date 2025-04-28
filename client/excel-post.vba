Sub CallPostAPI()
    Dim httpRequest As Object
    Dim url As String
    Dim body As String
    Dim responseText As String
    Dim filepath As String
    Dim fileData As String
    Dim fileStream As Object
    Dim fileSize As Long
    Dim chunkSize As Long
    Dim offset As Long

    ' API URL 및 Body 데이터 설정
    url = "https://lisyoen2.iptime.org:8040/savepost"
    ' 시트 B2 셀에서 파일 경로 가져오기
    filepath = ThisWorkbook.Sheets("Sheet1").Range("B2").Value

    ' 파일 읽기
    Set fileStream = CreateObject("ADODB.Stream")
    fileStream.Type = 1 ' Binary
    fileStream.Open
    fileStream.LoadFromFile filepath
    fileSize = fileStream.Size
    chunkSize = 1024 * 1024 ' 1MB 단위로 전송
    offset = 0

    Do While offset < fileSize
        ' 파일의 일부를 읽어 Base64로 인코딩
        fileStream.Position = offset
        fileData = EncodeBase64(fileStream.Read(chunkSize))

        ' Body 데이터 구성
        body = "{""filepath"":""" & Replace(filepath, "\", "/") & """,""offset"":" & offset & ",""data"":""" & fileData & """}"

        ' WinHttpRequest 객체 생성
        Set httpRequest = CreateObject("WinHttp.WinHttpRequest.5.1")
        
        With httpRequest
            ' HTTP 요청 설정
            .Open "POST", url, False
            .SetRequestHeader "Content-Type", "application/json"
            
            ' 요청 데이터 전송
            .Send body
            
            ' 응답 처리
            responseText = .ResponseText
        End With

        ' 응답 출력
        MsgBox "Offset: " & offset & " Response: " & responseText

        ' 다음 청크로 이동
        offset = offset + chunkSize
    Loop

    ' 객체 해제
    fileStream.Close
    Set fileStream = Nothing
    Set httpRequest = Nothing
End Sub

Function EncodeBase64(binaryData As Variant) As String
    Dim dom As Object
    Dim element As Object

    ' MSXML을 사용하여 Base64 인코딩
    Set dom = CreateObject("MSXML2.DOMDocument")
    Set element = dom.createElement("Base64Data")
    element.DataType = "bin.base64"
    element.nodeTypedValue = binaryData
    EncodeBase64 = element.Text

    Set element = Nothing
    Set dom = Nothing
End Function
