Sub CallPostAPI()
    Dim httpRequest As Object
    Dim url As String
    Dim body As String
    Dim responseText As String
 
    ' API URL 및 Body 데이터 설정
    url = "https://lisyoen.iptime.org:4040/savepost"
    body = "{""key"":""value""}"

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
    MsgBox responseText

    ' 객체 해제
    Set httpRequest = Nothing
End Sub
