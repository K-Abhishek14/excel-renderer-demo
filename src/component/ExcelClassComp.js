import React, { Component } from 'react';
import '../App.css'
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Card } from 'reactstrap';

class ExcelClassComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: false,
      rows: null,
      cols: null
    }
    this.fileInput = React.createRef();
  }

  renderFile = (fileObj) => {
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log("resp", resp);
        console.log(" assd", resp.rows[0])
        let arr = resp.rows[0].map((item, index) => {
          let obj = {}
          obj["name"] = item
          obj["key"] = index+1
          return obj
        })
        arr.unshift({ name: "", key: 0 })
        console.log("arrrrrrrr", arr)
        console.log("resp.cols", resp.cols);
        this.setState({
          dataLoaded: true,
          cols: arr,
          // cols : resp.cols,
          rows: resp.rows
        });
      }
    });
  }

  fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      console.log("FileObj", fileObj);
      let fileName = fileObj.name;
      if (fileName.slice(fileName.lastIndexOf('.') + 1) === "csv") {
        this.setState({
          uploadedFileName: fileName,
          isFormInvalid: false
        });
        this.renderFile(fileObj)
      }
      else {
        this.setState({
          isFormInvalid: true,
          uploadedFileName: ""
        })
      }
    }
  }
  openFileBrowser = () => {
    this.fileInput.current.click();
  }

  render() {
    console.log("Data Loaded", this.state.dataLoaded)
    console.log("Rows : ", this.state.rows);
    console.log("Cols : ", this.state.cols);
    return (
      <Container>
        <form>
          <FormGroup row>
            <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">Upload</Label>
            <Col xs={4} sm={8} lg={10}>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <Button color="info" style={{ color: "white", zIndex: 0 }} onClick={this.openFileBrowser.bind(this)}><i className="cui-file"></i> Browse&hellip;</Button>
                  <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event) => { event.target.value = null }} style={{ "padding": "10px" }} />
                </InputGroupAddon>
                <Input type="text" className="form-control" value={this.state.uploadedFileName} readOnly invalid={this.state.isFormInvalid} />
                <FormFeedback>
                  <Fade in={this.state.isFormInvalid} tag="h6" style={{ fontStyle: "italic" }}>
                    Please select a .xlsx file only !
                  </Fade>
                </FormFeedback>
              </InputGroup>
            </Col>
          </FormGroup>
        </form>
        {this.state.dataLoaded &&
          <div>
            <Card body outline color="secondary" className="restrict-card" style={{ height: '100%' }}>
              <OutTable data={this.state.rows} columns={this.state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
            </Card>
          </div>
        }
      </Container>
    );
  }
}

export default ExcelClassComp;
