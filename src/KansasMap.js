import React, {Component} from 'react';
import { Container } from '@material-ui/core';
import SVG from 'react-inlinesvg';
import kansas from './Kansas_revision.svg';
import { all } from 'q';

export default class KansasMap extends Component{
    

    // move to parent class


    render()
    {
       
        return (
            <svg id="Layer_1" style={{width:"100%", height:"auto"}} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2287 1865">
                <g id="Border"><path d="M26,19l3,1040,1872-1,.5-734.5s5-5,6-8-2-6-3-7-8,2-8,2-5,1-7-1-3-12-3-12l-10,5c-2,1-6,1-6,1s-6-3-8-5-7-6-7-6-9-3-9-4-1-8-1-12-15-13-15-13-6-10-7-15,4-10,4-10,3-6,3-9-4-4-4-4-5,4-6,3-11-16-11-16-6-9-8-8l-2,1s-6-2-8-7-3-13-6-16-7-1-9-9,2-11,2-11l6,3s7-3,7-5,1-8,0-16,9-16,9-16,8,2,9-3-2-18,0-20,6-3,7-2,4,9,6,9,10,0,12-2,5-6,5-9-2-5-4-5-10,4-12,2-5-6-4-7a5.2,5.2,0,0,1,4-2c2,0,4,2,7,1s4-5,4-7a12.21,12.21,0,0,0-6-10c-5-3-11-3-11-9a45.36,45.36,0,0,1,1-10s1-4-4-5-7,4-7,4-2,2-4,1-4,0-6,4-3,10-7,9-18-7-19-8-5-10-7-11-7,6-7,6a29.54,29.54,0,0,1-3-6,32.17,32.17,0,0,1-1-8s-10-4-12-7-11-6-11-6a5.37,5.37,0,0,1-6-3,9.79,9.79,0,0,1-1-7Z" transform="translate(178 396)"></path></g>
                <g id="District_9" onClick={()=>this.props.onSelect(9)} className={this.props.selectedDistrict === 9? "selected" : ""}><path class="cls-1" d="M651,582" transform="translate(178 396)"></path><polygon class="cls-2" points="2079 1087 2079 1453 1443 1453 1441 1068 1515 1067 1515 1070 1640 1069 1640 1040 1738 1038 1739 1085 2079 1087"></polygon><path class="cls-2" d="M1330,331" transform="translate(178 396)"></path></g>
                <g id="District_8" onClick={()=>this.props.onSelect(8)} className={this.props.selectedDistrict === 8? "selected" : ""}><polyline class="cls-1" points="828 977 828 1005 827 1005 829 1154 834 1158 832 1315 837 1315 839 1453 1441 1453 1441 1068 1438 1067 1437 1040 1191.84 1039.75 1189 1046 1170 1046 1168 1039 1104 1039 1103 1008 965 1007 965 980 828 977"></polyline></g>
                <g id="District_7" onClick={()=>this.props.onSelect(7)} className={this.props.selectedDistrict === 7? "selected" : ""}><polygon class="cls-3" points="206 1012.16 447.41 1008.38 619 1010.11 742.96 1007.04 824.04 1005.12 827 1155.35 832 1159.45 830 1316.96 835 1316.96 835 1453 206 1453 206 1012.16"></polygon></g>
                <g id="District_6" onClick={()=>this.props.onSelect(6)} className={this.props.selectedDistrict === 6? "selected" : ""}><path class="cls-4" d="M1333,285h-25v81h9l1,36h8l2,21-9,3,1,35-5,4,1,57h30v62l-2,2h-4l-1,81v4l121-1V641l102-1v47l338,2,1-344-45,1s-12-9-16-7-15,28-16,26-3-7-3-7-6,9-8,8-11-8-13-7-6,11-8,10-7-8-8-7-2,14-4,13-5-3-8-4-6-5-7-7-1,7-3,7-8-2-8-2V345l-26-1s-8,8-9,7-6-8-9-9-11-5-13-7-13,4-16,3a14.07,14.07,0,0,1-7-6c-1-2-4,4-7,4s-8-2-10,0-9-10-7-14a30.3,30.3,0,0,1,5-7l-2-29-111-1-1,30a7.27,7.27,0,0,0-5-5c-4-1-12-6-9-7s7,1,7,1,4-2,2-5-5-8-9-7-7,6-11,5-14-8-14-8-5-3-8-1-9,14-11,11-5-8-9-7-9,8-9,8-5,1-5-2-4,2-4,2h-3l-2,44-28,1-1-11-46,1-4-7-5,4-7-3-25-1Z" transform="translate(178 396)"></path></g>
                <g id="District_5" onClick={()=>this.props.onSelect(5)} className={this.props.selectedDistrict === 5? "selected" : ""}><polyline class="cls-5" points="827 708.5 1104.2 708.5 1106.19 681.5 1241.31 681.5 1244.29 766.5 1385.38 769.5 1385.38 711.5 1483.74 709.5 1483.74 766.5 1492.68 766.5 1494.67 801.5 1502.62 801.5 1502.62 818.5 1493.67 818.5 1496.65 856.5 1491.69 859.5 1492.68 920.5 1520.5 920.5 1520.5 978.5 1515.53 978.5 1515.53 1063.5 1442.01 1065.5 1440.02 1036.5 1192.63 1036.5 1189.65 1043.5 1173.75 1043.5 1172.76 1036.5 1108.18 1036.5 1107.18 1006.5 968.09 1003.5 968.09 978.5 831.84 974.34 830.97 861.5 827 854.22 827 708.5"></polyline><path class="cls-4" d="M729,666" transform="translate(178 396)"></path></g>
                <g id="District_4" onClick={()=>this.props.onSelect(4)} className={this.props.selectedDistrict === 4? "selected" : ""}><polygon class="cls-6" points="206 708 206 1007 609 1007 697 1007 827 1004 827 861 823 857 823 708 206 708"></polygon><path class="cls-6" d="M383,798" transform="translate(178 396)"></path></g>
                <g id="District_3" onClick={()=>this.props.onSelect(3)} className={this.props.selectedDistrict === 3? "selected" : ""}><path class="cls-7" d="M1350,20l-1,146-38,1-1,117,26-1v44l24,1,6,3,6-4,5,7,47-2,1,10,25,1,1-40s1-3,2-4,3,0,3,0,2-3,4-3,2,2,2,3,2,0,2,0l5-6s4-5,8-2,3,4,3,4,2,3,6,0a13.9,13.9,0,0,0,5-7s5-3,9-1,9,5,9,5a13.63,13.63,0,0,0,6,3c4,1,9-4,9-4a7.65,7.65,0,0,1,5-2c3,0,6,5,6,5s2,5,2,7,0,6-3,5-4,0-4,0l5,2a10.34,10.34,0,0,0,4,1c2,0,2,4,2,4V283l114,2,2,29-5,7s1,12,3,14,4-1,4-1l5,1,9-5s3-2,3,1,3,6,3,6,8-2,10-3,5-2,7-1a59.23,59.23,0,0,1,6,4s5,1,6,2a61.25,61.25,0,0,0,6,4l4,5,10-7,28,1v26a43.31,43.31,0,0,0,5,1c1,0,2-3,2-6s3,0,3,0,2,4,3,4,4,2,5,2,2,4,5,3,2-2,2-2a56.38,56.38,0,0,0,1-7,3.7,3.7,0,0,1,2-3s4,1,5,4a11,11,0,0,0,2,4l7-9a5,5,0,0,1,5-1,32.17,32.17,0,0,1,7,4l1,2a6.46,6.46,0,0,0,5-3c2-3,3-5,4-5s2,0,3,2a13.38,13.38,0,0,1,1,5,50.71,50.71,0,0,0,7-15c2-8,11-11,11-11l14,6,45-1V317l3-5a22.69,22.69,0,0,0,1-4c0-1,0-2-2-2s-7,2-7,2-8,1-9-5a61.73,61.73,0,0,1-1-9l-9,5s-5,2-6,1-2,1-6-3-5-5-7-6-10-4-10-4a6.93,6.93,0,0,1-3-4,32.17,32.17,0,0,1-1-8s0-5-3-7-12-8-14-11-5-8-5-14,5-11,5-11,3-5,2-7-4,0-4,0-2,2-4,1-7-7-7-7l-11-17s-3,3-4,2-7-5-8-7-4-8-4-12-4-6-4-6-6-2-7-5-1-8-1-11a7.65,7.65,0,0,1,2-5s1-1,4,0a15.77,15.77,0,0,0,4,1s4,0,6-5-2-9-1-13,3-10,5-12,3-5,5-5h5s3,0,4-5-2-11-2-11-1-7,1-8,5-3,8-2,4,5,4,5,2,5,3,5,8-1,10-2,4-3,5-7-3-4-3-4-6,2-7,2-6,2-8-3-1-7,0-8,5-1,5-1a43.31,43.31,0,0,0,5,1c1,0,3-2,3-3s0-6-1-8-6-4-6-4-7-2-8-4-3-3-2-10,1-8,1-8a3.49,3.49,0,0,0-2-1h-4l-3,5s-2,2-4,1-2-3-4,0-5,9-5,9a3.1,3.1,0,0,1-4,2c-3-1-11-3-16-5s-8-8-8-8-3-5-4-5-4,5-5,5-2,0-3-2-2-1-2-8-9-8-9-8-6-3-8-6-6-2-6-2-4,1-5-2a11,11,0,0,0-2-4Z" transform="translate(178 396)"></path><path class="cls-7" d="M1469-190" transform="translate(178 396)"></path></g>
                <g id="District_2" onClick={()=>this.props.onSelect(2)} className={this.props.selectedDistrict === 2? "selected" : ""}><polyline class="cls-8" points="820 416 816 556 822 556 824 705 1098 706 1100 678 1242 679 1244 764 1381 766 1382 709 1482 707 1486 560 1524 559 1524 416"></polyline></g>
                <g id="District_1" onClick={()=>this.props.onSelect(1)} className={this.props.selectedDistrict === 1? "selected" : ""}><polygon class="cls-9" points="206 416 819.06 417.39 814.07 560.39 819 560 819 705 206 705 206 416"></polygon><path class="cls-9" d="M941-149" transform="translate(178 396)"></path></g>
            </svg>

        );
        
    }
}
