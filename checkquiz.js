$(document).ready(function(){
	scroll_settings = {autoReinitialise: true,stickToBottom:true,wheelSpeed: 200};
	col_quiz_content=$("#col-quiz-content");
	close_page=true;
	$("#div-check-quiz").jScrollPane(scroll_settings);
	
	
	var check_quiz=$("html").checkquiz({total_q:total_q,enable_check:false});
	
	if(view_history==true){
		console.log('history');
		check_quiz.check_quiz_results(history_answers.results);
		$("#check-quiz").addClass('check-quized');
		$("#check-top-quiz").addClass('check-top-quized');
	}

	$("#btn-toggle-checkquiz").live('click',function(){
		//console.log(col_quiz_content.data('jsp').getContentPositionY());
		$("#check-top-quiz").toggle();
	});
	
	
	$(".start-time").live('click',function(){
			//Khởi tạo thời gian
		close_page=false;
		if((online && user_online) || !online)
		{
			if(not_start){
				toastr.error("Bạn đã làm bài thi online này , bạn chỉ được làm lại sau khi đề thi đóng");
			}
			else if(stop_quiz==true){
				toastr.error("Đang trong thời gian công bố kết quả, bạn chưa được làm lại bài cho tới khi đề thi mở lại ^_^");
			}
			else{
				var phut=post_time;
				var giay=0,s_giay,s_phut,time;
				timer=setInterval(function(){
					if(giay==0) {
						phut--;
						if(phut==-1) {
							//alert("Hết giờ làm bài");
							if(!close_page) nap_bai();
						}
						giay=60;
					}
					giay--;
					if(giay%10==giay)
						s_giay="0"+giay;
					else s_giay=giay;
					time=phut+" : "+s_giay;
					$(".time-text").html(time);			
				},1000);
				enable_check=true;
				check_quiz.set_enable_check();
				$(".start-time").css('display','none');
				$(".nap-bai").css('display','inline-block');
				toastr.success("Thời gian đã bắt đầu , chúc bạn làm bài tốt");

				$(".quiz-information").css('display','none');
				$("#quiz-content").fadeIn();
				set_event_close();
				add_view();
			}
		} else{
			toastr.error("Bạn cần <a href='"+url_login+"'>đăng nhập</a> để làm đề thi online ");
		}
	});
	$(".nap-bai").live('click',function(){
		s_confirm=confirm("Bạn có muốn nạp bài không ?");
		if(s_confirm){
			nap_bai();
			close_page=true;
		}
	});
	function add_view(){
		$.ajax({
				type:"POST",url:url_add_view,dataType:"json",
				data:{'post_id':post_id}});
	}
	function nap_bai(){
		$.ajax({
				type:"POST",url:url_check,dataType:"json",
				data:{'post_id':post_id,'answers':check_quiz.get_quiz()},
				beforeSend:function(){
					$(".nap-bai").remove();
					$(".loading").fadeIn();
				},
				success:function(results){
					$(".time").css('display','none');
					$(".nap-bai").remove();
					$(".start-new").css('display','block');
					$(".loading").remove();
					if(online==false){
						check_quiz.check_quiz_results(results.results);
						$("#div-check-quiz").css('height','66%');
						$("#check-quiz").addClass('check-quized');
						$("#check-top-quiz").addClass('check-top-quized');
						$(".result").fadeIn();
						$(".result .score-quiz").html(results.score+"/"+total_q);
						toastr.success("Bạn đạt số điểm: "+results.score+"/"+total_q);
					}
					else {
						$("#div-check-quiz").css('height','70%');
						$(".result").html('<h4 class="text-success">Bạn đã hoàn thành đề thi , kết quả sẽ được công bố khi đóng đề , hihi ^_^</h4>')
						$(".result").fadeIn();
						toastr.success("Bạn đã hoàn thành đề thi , kết quả sẽ được công bố khi đóng đề");
					}
				}
			});
	}
	function set_event_close(){
		window.onbeforeunload = function (e) {
		    e = e || window.event;

		    if(!close_page){
			    // For IE and Firefox prior to version 4
			    if (e) {
			        e.returnValue = 'Bạn đang làm đề thi  , bạn có chắc chắn muốn thoát ? ';
			    }

			    // For Safari
			    return 'Bạn đang làm đề thi  , bạn có chắc chắn muốn thoát ? ';
			}
		};
	}

	var col_3_slide=$("#col-3").menuslide({element_action:'#button-slide-col-3',element_slide:'#col-3',position:"right"});

	function resize_do(){
		width=parseInt($(window).width());
		scrollTop=parseInt($(window).scrollTop());
		if(width<=739){
			col_quiz_content.addClass('col-quiz-content-mobile');
			$("#div-check-top-quiz").fadeIn();
			if(scrollTop>=100){
				col_quiz_content.find('#div-check-top-quiz').addClass('div-check-top-quiz-fixed');
			}
			else{
				col_quiz_content.find('#div-check-top-quiz').removeClass('div-check-top-quiz-fixed');
			}
		}
		else {
			col_quiz_content.removeClass('col-quiz-content-mobile');
			$("#div-check-top-quiz").fadeOut();
		}
		if(!pdf_checked)
		{	//Hiện cọt sô 3
			if(width>991){
				col_3_slide.removeslide();
				$('.menu-button-slide.right').css('display','none');
				$(".col-3").jScrollPane(scroll_settings);
			}
			else{
				col_3_slide.setupslide();
				$('.menu-button-slide.right').css('display','block');
			}
		}
		else{
			$("#col-3").css('z-index','600');
			$("#col-3").addClass('col-3-right');
			$('.menu-button-slide.right').css('display','block');
		}
	}
	
});
